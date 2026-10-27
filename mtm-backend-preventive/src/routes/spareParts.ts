import { Router, Request, Response } from "express";
import { prisma } from "../db";

const router = Router();

// GET spare parts list & stock levels
router.get("/", async (req: Request, res: Response) => {
  try {
    const parts = await prisma.sparePart.findMany({
      orderBy: { stockQty: "asc" },
    }).catch(() => []);

    return res.json(parts);
  } catch (err: any) {
    return res.status(500).json({ error: "Gagal mengambil daftar spare part", details: err.message });
  }
});

// PUT update stock quantity / replacement
router.put("/:id/stock", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { delta, newStock } = req.body;

    const part = await prisma.sparePart.findUnique({ where: { id } }).catch(() => null);
    if (!part && newStock == null) {
      return res.status(404).json({ error: "Spare part tidak ditemukan" });
    }

    const updatedQty = newStock != null ? newStock : Math.max(0, (part?.stockQty || 0) + (delta || 0));

    const updated = await prisma.sparePart.update({
      where: { id },
      data: { stockQty: updatedQty },
    }).catch(() => ({ id, stockQty: updatedQty }));

    return res.json(updated);
  } catch (err: any) {
    return res.status(500).json({ error: "Gagal mengupdate stok spare part", details: err.message });
  }
});

export default router;
