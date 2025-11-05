import bcrypt from "bcryptjs";
import express from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";

const router = express.Router();


/**
 * POST /api/auth/register
 * Body: { email, password, name, role? }
 */
router.post("/register", async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ ok: false, message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        name,
        role: role || "USER",
      },
    });

    const token = jwt.sign(
      { sub: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      ok: true,
      token,
      user: { id: user.id, email: user.email, role: user.role, name: user.name },
    });
  } catch (err) {
    console.error("[auth/register]", err);
    res.status(500).json({ ok: false, message: "Server error" });
  }
});


// LOGIN route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ ok: false, message: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.password || "");
    if (!valid) {
      return res.status(400).json({ ok: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { sub: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      ok: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
    });
  } catch (err) {
    console.error("[auth/login]", err);
    res.status(500).json({ ok: false, message: "Server error" });
  }
});

export default router;