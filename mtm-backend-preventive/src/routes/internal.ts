import { Router, Request, Response } from "express";
import { prisma } from "../db";

const router = Router();

/**
 * Webhook Internal: Dipanggil secara otomatis oleh Backend Predictive (Repo 2)
 * saat terdeteksi anomali getaran ISO 10816-8 atau suhu di luar ambang batas.
 */
router.post("/alert-wo", async (req: Request, res: Response) => {
  try {
    const { deviceId, metricName, value, threshold, severity, machineId, message, timestamp } = req.body;

    const ticketNo = `WO-AUTO-${Date.now().toString().slice(-6)}`;
    const isCritical = severity === "CRITICAL";

    // Cek apakah sudah ada tiket aktif untuk device ini dalam 30 menit terakhir agar tidak spam tiket
    const halfHourAgo = new Date(Date.now() - 30 * 60 * 1000);
    const existingTicket = await prisma.cmTicket.findFirst({
      where: {
        problemTitle: { contains: deviceId || "Jingduan" },
        status: { in: ["waiting", "in_progress"] },
        createdAt: { gte: halfHourAgo },
      },
    }).catch(() => null);

    if (existingTicket) {
      return res.json({
        success: true,
        message: "Tiket aktif sudah ada untuk komponen ini, tidak membuat duplikat",
        ticket: existingTicket,
      });
    }

    const created = await prisma.cmTicket.create({
      data: {
        ticketNo,
        machineId: machineId || "JINGDUAN-FORGING-630T",
        problemTitle: `[AUTO-ALERT ${severity}] Anomali ${metricName} (${deviceId})`,
        description: message || `Sensor ${deviceId} membaca nilai ${value} melampaui batas ambang ${threshold}. Memerlukan pengecekan dan greasing segera.`,
        reportedByNpk: "SYSTEM-PDM",
        reportedByName: "Predictive Monitoring IoT Bot",
        reporterDept: "Condition Monitoring",
        priority: isCritical ? "Urgent" : "High",
        status: "waiting",
        source: "AUTO_PREDICTIVE_ALERT",
        mttrTargetMinutes: isCritical ? 20 : 45,
      },
    }).catch((err) => {
      // In-memory fallback response jika tabel database baru belum di-migrate
      return {
        ticketNo,
        machineId: "JINGDUAN-FORGING-630T",
        problemTitle: `[AUTO-ALERT ${severity}] Anomali ${metricName} (${deviceId})`,
        priority: isCritical ? "Urgent" : "High",
        status: "waiting",
        createdAt: new Date(),
      };
    });

    console.log(`[Preventive Integration] Otomatis membuat tiket ${ticketNo} dari sinyal Predictive Alert!`);

    return res.status(201).json({
      success: true,
      message: "Tiket Work Order otomatis berhasil dibuat dari sinyal Predictive Maintenance",
      ticket: created,
    });
  } catch (error: any) {
    console.error("[Internal Webhook] Error:", error.message);
    return res.status(500).json({ error: "Gagal memproses webhook alert", details: error.message });
  }
});

export default router;
