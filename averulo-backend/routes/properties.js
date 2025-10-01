// routes/properties.js
import express from "express";
import { auth } from "../lib/auth.js";
import { prisma } from "../lib/prisma.js";
import { requireRole } from "../lib/roles.js";

const router = express.Router();
const authOptional = auth(false);

/**
 * GET /api/properties
 * Query: page, limit, city, q
 * - Public: returns ACTIVE properties
 * - If logged in, annotates each with isFavorite
 */
router.get("/", authOptional, async (req, res) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit || "10", 10)));
    const skip  = (page - 1) * limit;

    const city      = req.query.city?.trim();
    const search    = req.query.q?.trim();
    const minPrice  = req.query.minPrice ? Number(req.query.minPrice) : undefined;
    const maxPrice  = req.query.maxPrice ? Number(req.query.maxPrice) : undefined;
    const minRating = req.query.minRating ? Number(req.query.minRating) : undefined;

    // where
    const where = {
      status: "ACTIVE",
      ...(city ? { city: { contains: city, mode: "insensitive" } } : {}),
      ...(search ? {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
          { city: { contains: search, mode: "insensitive" } },
        ],
      } : {}),
      ...(minPrice != null || maxPrice != null ? {
        nightlyPrice: {
          ...(minPrice != null ? { gte: minPrice } : {}),
          ...(maxPrice != null ? { lte: maxPrice } : {}),
        }
      } : {}),
      ...(minRating != null ? { avgRating: { gte: minRating } } : {}),
    };

    // sort
    const sort = (req.query.sort || "newest").toString();
    let orderBy;
    switch (sort) {
      case "price_asc":  orderBy = { nightlyPrice: "asc" }; break;
      case "price_desc": orderBy = { nightlyPrice: "desc" }; break;
      case "rating_desc": orderBy = { avgRating: "desc" }; break;
      case "rating_asc": orderBy = { avgRating: "asc" }; break;
      default: orderBy = { createdAt: "desc" }; // newest
    }

    // user faves (for isFavorite flag)
    let faveIds = new Set();
    if (req.user?.sub) {
      const favorites = await prisma.favorite.findMany({
        where: { userId: req.user.sub },
        select: { propertyId: true },
      });
      faveIds = new Set(favorites.map(f => f.propertyId));
    }

    const [total, itemsRaw] = await Promise.all([
      prisma.property.count({ where }),
      prisma.property.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        select: {
          id: true, title: true, city: true, nightlyPrice: true, status: true,
          lat: true, lng: true,
          avgRating: true, reviewsCount: true, favoritesCount: true,
          host: { select: { id: true, email: true, name: true } },
        },
      }),
    ]);

    const items = itemsRaw.map(p => ({
      ...p,
      isFavorite: req.user?.sub ? faveIds.has(p.id) : false,
    }));

    res.json({ page, limit, total, items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch properties", detail: err.message });
  }
});

/**
 * GET /api/properties/:id
 * - Public: returns property details
 * - If logged in, adds isFavorite
 */
router.get("/:id", authOptional, async (req, res) => {
  try {
    const prop = await prisma.property.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        title: true,
        description: true,
        city: true,
        address: true,
        lat: true,
        lng: true,
        nightlyPrice: true,
        status: true,
        avgRating: true,
        reviewsCount: true,
        favoritesCount: true,
        host: { select: { id: true, email: true, name: true } },
        reviews: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            guest: { select: { id: true, name: true, email: true } },
          },
          take: 5, 
        },
      },
    });


    if (!prop) return res.status(404).json({ error: "Not found" });

    let isFavorite = false;
    if (req.user?.sub) {
      const fave = await prisma.favorite.findUnique({
        where: { userId_propertyId: { userId: req.user.sub, propertyId: prop.id } },
        select: { id: true },
      });
      isFavorite = Boolean(fave);
    }

    res.json({ ...prop, isFavorite });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch property", detail: err.message });
  }
});

/**
 * POST /api/properties
 * - HOST/ADMIN can create a property
 */
router.post("/", auth(true), requireRole("ADMIN", "HOST"), async (req, res) => {
  try {
    const { title, city, lat, lng, nightlyPrice, status = "ACTIVE", description, address } = req.body;

    if (!title || !city || nightlyPrice == null) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const created = await prisma.property.create({
      data: {
        title,
        description: description || null,
        address: address || null,
        city,
        lat: Number(lat),
        lng: Number(lng),
        nightlyPrice: Number(nightlyPrice),
        status,
        host: { connect: { id: req.user.sub } }, // ✅ use sub
      },
      select: {
        id: true,
        title: true,
        city: true,
        nightlyPrice: true,
        status: true,
        hostId: true,
        createdAt: true,
      },
    });

    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create property", detail: err.message });
  }
});

export default router;