import { prisma } from '../lib/prisma.js';

export async function getPropertyStats(req, res) {
  try {
    const totalProperties = await prisma.property.count();
    const avgRating = await prisma.property.aggregate({ _avg: { avgRating: true } });
    const favoritesCount = await prisma.property.aggregate({ _sum: { favoritesCount: true } });
    const reviewsCount = await prisma.property.aggregate({ _sum: { reviewsCount: true } });

    res.json({
      totalProperties,
      avgRating: avgRating._avg.avgRating || 0,
      favoritesCount: favoritesCount._sum.favoritesCount || 0,
      reviewsCount: reviewsCount._sum.reviewsCount || 0,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch property stats', details: error.message });
  }
}
