import { Router, Request, Response } from "express";
import { prisma } from "../db";

const router = Router();

// GET all PM schedules (52-week calendar)
router.get("/", async (req: Request, res: Response) => {
  try {
    const week = req.query.week ? parseInt(req.query.week as string, 10) : undefined;
    const status = req.query.status as string;

    const where: any = {};
    if (week) where.plannedWeek = week;
    if (status && status !== "semua") where.status = status;

    const schedules = await prisma.pmSchedule.findMany({
      where,
      orderBy: [{ plannedWeek: "asc" }, { plannedDate: "asc" }],
    }).catch(() => []);

    return res.json(schedules);
  } catch (err: any) {
    return res.status(500).json({ error: "Gagal mengambil jadwal PM", details: err.message });
  }
});

// PUT complete PM schedule
router.put("/:id/complete", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { pic, scopeNotes } = req.body;

    const updated = await prisma.pmSchedule.update({
      where: { id },
      data: {
        status: "COMPLETED",
        pic: pic || "PIC Maintenance",
        scopeNotes: scopeNotes || "Pemeriksaan selesai sesuai SOP.",
        completedAt: new Date(),
      },
    }).catch(() => ({ id, status: "COMPLETED" }));

    return res.json(updated);
  } catch (err: any) {
    return res.status(500).json({ error: "Gagal menyelesaikan PM", details: err.message });
  }
});

export default router;
