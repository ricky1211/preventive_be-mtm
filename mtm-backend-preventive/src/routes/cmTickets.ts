import { Router, Request, Response } from "express";
import { prisma } from "../db";

const router = Router();

// GET all CM tickets
router.get("/", async (req: Request, res: Response) => {
  try {
    const status = req.query.status as string;
    const where: any = {};
    if (status && status !== "semua") {
      where.status = status;
    }

    const tickets = await prisma.cmTicket.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100,
    }).catch(() => []);

    return res.json(tickets);
  } catch (err: any) {
    return res.status(500).json({ error: "Gagal mengambil tiket CM", details: err.message });
  }
});

// POST create manual CM ticket
router.post("/", async (req: Request, res: Response) => {
  try {
    const { problemTitle, description, reportedByNpk, reportedByName, reporterDept, priority } = req.body;

    if (!problemTitle || !reportedByNpk) {
      return res.status(400).json({ error: "Judul masalah dan NPK pelapor wajib diisi" });
    }

    const ticketNo = `CM-${Date.now().toString().slice(-6)}`;

    const created = await prisma.cmTicket.create({
      data: {
        ticketNo,
        problemTitle,
        description: description || "",
        reportedByNpk,
        reportedByName: reportedByName || reportedByNpk,
        reporterDept: reporterDept || "Produksi",
        priority: priority || "High",
        status: "waiting",
      },
    }).catch(() => ({
      ticketNo,
      problemTitle,
      reportedByNpk,
      status: "waiting",
      createdAt: new Date(),
    }));

    return res.status(201).json(created);
  } catch (err: any) {
    return res.status(500).json({ error: "Gagal membuat tiket", details: err.message });
  }
});

// PUT update ticket status
router.put("/:id/status", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { status, actionTaken, assignedPic } = req.body;

    const data: any = {};
    if (status) data.status = status;
    if (actionTaken) data.actionTaken = actionTaken;
    if (assignedPic) data.assignedPic = assignedPic;
    if (status === "resolved" || status === "closed") {
      data.resolvedAt = new Date();
    }

    const updated = await prisma.cmTicket.update({
      where: { id },
      data,
    }).catch(() => ({ id, status, updatedAt: new Date() }));

    return res.json(updated);
  } catch (err: any) {
    return res.status(500).json({ error: "Gagal mengupdate tiket", details: err.message });
  }
});

export default router;
