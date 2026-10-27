import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";

const router = Router();

// Login dengan NPK atau Username
router.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username) {
    return res.status(400).json({ error: "NPK atau Username wajib diisi" });
  }

  const cleanUser = String(username).trim();
  const isAdmin = cleanUser.toUpperCase() === "ADMIN" || cleanUser === "0001";

  const user = {
    npk: cleanUser,
    username: cleanUser,
    displayName: isAdmin ? "PIC Maintenance" : cleanUser,
    role: isAdmin ? "Admin / PIC Maintenance" : "Operator Produksi",
    dept: isAdmin ? "Maintenance" : "Produksi Forging",
  };

  const token = jwt.sign(user, config.jwt.secret, {
    expiresIn: "7d",
  });

  return res.json({
    success: true,
    user,
    token,
  });
});

export default router;
