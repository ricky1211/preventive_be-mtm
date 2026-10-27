import { Router, Request, Response } from "express";
import { prisma } from "../db";

const router = Router();

// GET all TPM tasks
router.get("/", async (req: Request, res: Response) => {
  try {
    const tasks = await prisma.tpmTask.findMany({
      orderBy: { createdAt: "desc" },
    }).catch(() => []);

    return res.json(tasks);
  } catch (err: any) {
    return res.status(500).json({ error: "Gagal mengambil data TPM", details: err.message });
  }
});

// PUT complete TPM inspection task
router.put("/:id/check", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { status, checkedBy, notes } = req.body;

    const updated = await prisma.tpmTask.update({
      where: { id },
      data: {
        status: status || "DONE",
        checkedBy: checkedBy || "Operator",
        checkedAt: new Date(),
        notes: notes || "Pengecekan mandiri selesai.",
      },
    }).catch(() => ({ id, status: status || "DONE" }));

    return res.json(updated);
  } catch (err: any) {
    return res.status(500).json({ error: "Gagal mengupdate TPM task", details: err.message });
  }
});

export default router;
