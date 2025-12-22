// routes/properties.js
import express from "express";
import { getPropertyStats } from "../controllers/propertiesController.js";
import { auth } from "../lib/auth.js";
import { prisma } from "../lib/prisma.js";
import { requireRole } from "../lib/roles.js";

const router = express.Router();

// Haversine formula to calculate distance between two coordinates (in km)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

// GET /api/properties/stats
router.get("/stats", getPropertyStats);
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

    // Location-based search params
    const userLat = req.query.lat ? Number(req.query.lat) : null;
    const userLon = req.query.lon ? Number(req.query.lon) : null;
    const radius = req.query.radius ? Number(req.query.radius) : 10; // Default 10km

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

    // If location search is enabled, fetch all and filter by distance
    let itemsRaw;
    let total;

    if (userLat != null && userLon != null) {
      // Fetch all active properties with coordinates
      const allProperties = await prisma.property.findMany({
        where: {
          ...where,
          lat: { not: null },
          lng: { not: null },
        },
        select: {
          id: true, title: true, city: true, nightlyPrice: true, status: true,
          lat: true, lng: true,
          avgRating: true, reviewsCount: true, favoritesCount: true,
          host: { select: { id: true, email: true, name: true } },
        },
      });

      // Filter by distance and add distance field
      const propertiesWithDistance = allProperties
        .map(p => ({
          ...p,
          distance: calculateDistance(userLat, userLon, p.lat, p.lng),
        }))
        .filter(p => p.distance <= radius)
        .sort((a, b) => a.distance - b.distance); // Sort by distance

      total = propertiesWithDistance.length;
      itemsRaw = propertiesWithDistance.slice(skip, skip + limit);
    } else {
      // Regular search without location
      [total, itemsRaw] = await Promise.all([
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
    }

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
            reply: true,
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