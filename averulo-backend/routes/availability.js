// routes/availability.js
import express from "express";
import { z } from "zod";
import { auth } from "../lib/auth.js";
import { prisma } from "../lib/prisma.js";
import { requireRole } from "../lib/roles.js";
import { validate } from "../lib/validate.js";

const router = express.Router();

// ── Schemas
const upsertSchema = z.object({
  propertyId: z.string().min(1),
  startDate: z.coerce.date(),
  endDate:   z.coerce.date(),
  note:      z.string().max(200).optional().nullable(),
});

const listSchema = z.object({
  propertyId: z.string().min(1),
});

const idParam = z.object({ id: z.string().min(1) });

// ── Create a blackout block (HOST/ADMIN)
router.post("/", auth(true), requireRole("HOST", "ADMIN"), validate(upsertSchema), async (req, res) => {
  const { propertyId, startDate, endDate, note } = req.body;

  // host can only modify own property
  const prop = await prisma.property.findUnique({ where: { id: propertyId }, select: { hostId: true }});
  if (!prop) return res.status(404).json({ error: "Property not found" });
  if (req.user.role === "HOST" && prop.hostId !== req.user.sub) {
    return res.status(403).json({ error: "Not your property" });
  }

  // normalize order
  const start = new Date(Math.min(+new Date(startDate), +new Date(endDate)));
  const end   = new Date(Math.max(+new Date(startDate), +new Date(endDate)));

  const created = await prisma.availabilityBlock.create({
    data: { propertyId, startDate: start, endDate: end, note: note || null },
    select: { id: true, propertyId: true, startDate: true, endDate: true, note: true, createdAt: true },
  });

  res.status(201).json(created);
});

// ── List blocks for a property (HOST/ADMIN)
router.get("/", auth(true), requireRole("HOST", "ADMIN"), validate(listSchema, "query"), async (req, res) => {
  const { propertyId } = req.query;

  const prop = await prisma.property.findUnique({ where: { id: propertyId }, select: { hostId: true }});
  if (!prop) return res.status(404).json({ error: "Property not found" });
  if (req.user.role === "HOST" && prop.hostId !== req.user.sub) {
    return res.status(403).json({ error: "Not your property" });
  }

  const rows = await prisma.availabilityBlock.findMany({
    where: { propertyId },
    orderBy: { startDate: "asc" },
  });

  res.json(rows);
});

// ── Delete a block (HOST/ADMIN)
router.delete("/:id", auth(true), requireRole("HOST", "ADMIN"), validate(idParam, "params"), async (req, res) => {
  const blk = await prisma.availabilityBlock.findUnique({
    where: { id: req.params.id },
    include: { property: { select: { hostId: true } } },
  });
  if (!blk) return res.status(404).json({ error: "Block not found" });
  if (req.user.role === "HOST" && blk.property.hostId !== req.user.sub) {
    return res.status(403).json({ error: "Not your property" });
  }

  await prisma.availabilityBlock.delete({ where: { id: blk.id } });
  res.json({ success: true });
});

export default router;