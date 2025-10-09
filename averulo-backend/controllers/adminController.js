// controllers/adminController.js
import { prisma } from "../lib/prisma.js";

/**
 * GET /api/admin/analytics
 * Combines main stats, time-aware insights, and leaderboards.
 */
export async function getAnalytics(req, res) {
  try {
    const [
      totalUsers,
      totalProperties,
      totalBookings,
      totalRevenueAgg,
      totalReviews,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.property.count(),
      prisma.booking.count(),
      prisma.booking.aggregate({
        _sum: { totalAmount: true },
        where: { paymentStatus: "SUCCESS" },
      }),
      prisma.review.count(),
    ]);

    const totalRevenue = totalRevenueAgg._sum.totalAmount || 0;

    // Time filters
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());

    const [monthlyRevenueAgg, newUsersThisMonth, bookingsThisWeek] =
      await Promise.all([
        prisma.booking.aggregate({
          _sum: { totalAmount: true },
          where: {
            paymentStatus: "SUCCESS",
            createdAt: { gte: startOfMonth },
          },
        }),
        prisma.user.count({
          where: { createdAt: { gte: startOfMonth } },
        }),
        prisma.booking.count({
          where: { createdAt: { gte: startOfWeek } },
        }),
      ]);

    const monthlyRevenue = monthlyRevenueAgg._sum.totalAmount || 0;

    // Average occupancy rate (rough estimate)
    const avgOccupancyRate = Math.min(
      100,
      Math.round((totalBookings / (totalProperties * 12)) * 100)
    );

    // Top cities by number of properties
    const cityCounts = await prisma.property.groupBy({
      by: ["city"],
      _count: { city: true },
      orderBy: { _count: { city: "desc" } },
    });
    const topCities = cityCounts.map((c) => ({
      city: c.city,
      count: c._count.city,
    }));

    // Fetch leaderboards
    const [topHosts, topProperties] = await Promise.all([
      prisma.user.findMany({
        where: { role: "HOST" },
        select: {
          id: true,
          name: true,
          email: true,
          properties: {
            select: {
              avgRating: true,
              bookings: {
                where: { paymentStatus: "SUCCESS" },
                select: { totalAmount: true },
              },
            },
          },
        },
      }),
      prisma.property.findMany({
        select: {
          id: true,
          title: true,
          city: true,
          avgRating: true,
          host: { select: { email: true } },
          bookings: {
            where: { paymentStatus: "SUCCESS" },
            select: { totalAmount: true },
          },
        },
      }),
    ]);

    const formattedHosts = topHosts
      .map((host) => {
        const totalEarnings = host.properties.flatMap((p) => p.bookings)
          .reduce((sum, b) => sum + (b.totalAmount || 0), 0);
        const totalBookings = host.properties.flatMap((p) => p.bookings).length;
        const allRatings = host.properties.map((p) => p.avgRating).filter(Boolean);
        const avgRating =
          allRatings.length > 0
            ? allRatings.reduce((a, b) => a + b, 0) / allRatings.length
            : 0;
        return {
          id: host.id,
          name: host.name,
          email: host.email,
          totalEarnings,
          totalBookings,
          avgRating: Number(avgRating.toFixed(1)),
        };
      })
      .sort((a, b) => b.totalEarnings - a.totalEarnings)
      .slice(0, 5);

    const formattedProperties = topProperties
      .map((p) => {
        const totalRevenue = p.bookings.reduce(
          (sum, b) => sum + (b.totalAmount || 0),
          0
        );
        return {
          id: p.id,
          title: p.title,
          city: p.city,
          hostEmail: p.host?.email || null,
          totalRevenue,
          totalBookings: p.bookings.length,
          avgRating: Number(p.avgRating?.toFixed(1) || 0),
        };
      })
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 5);

    // Final response
    res.json({
      totalUsers,
      totalProperties,
      totalBookings,
      totalRevenue,
      totalReviews,
      avgOccupancyRate,
      monthlyRevenue,
      newUsersThisMonth,
      bookingsThisWeek,
      topCities,
      topHosts: formattedHosts,
      topProperties: formattedProperties,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch analytics", detail: err.message });
  }
}

/**
 * GET /api/admin/analytics/trends
 * Returns revenue and bookings trend for the last 6 months.
 */
export async function getAnalyticsTrends(req, res) {
  try {
    const now = new Date();

    // Compute last 6 months (including current)
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = d.toLocaleString("default", { month: "short" });
      const monthStart = new Date(d.getFullYear(), d.getMonth(), 1);
      const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 1);
      months.push({ label: monthName, start: monthStart, end: monthEnd });
    }

    // For each month, get revenue & booking count
    const revenueTrend = [];
    const bookingsTrend = [];

    for (const m of months) {
      const revenueAgg = await prisma.booking.aggregate({
        _sum: { totalAmount: true },
        where: {
          paymentStatus: "SUCCESS",
          createdAt: { gte: m.start, lt: m.end },
        },
      });

      const bookingsCount = await prisma.booking.count({
        where: { createdAt: { gte: m.start, lt: m.end } },
      });

      revenueTrend.push({
        month: m.label,
        total: revenueAgg._sum.totalAmount || 0,
      });
      bookingsTrend.push({ month: m.label, count: bookingsCount });
    }

    res.json({ revenueTrend, bookingsTrend });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Failed to fetch trends", detail: err.message });
  }
}

/**
 * GET /api/admin/top-hosts
 * Returns top 5 hosts ranked by total revenue.
 */
export async function getTopHosts(req, res) {
  try {
    // Get total earnings & booking counts for each host
    const topHosts = await prisma.user.findMany({
      where: { role: "HOST" },
      select: {
        id: true,
        name: true,
        email: true,
        properties: {
          select: {
            id: true,
            title: true,
            avgRating: true,
            bookings: {
              where: { paymentStatus: "SUCCESS" },
              select: { totalAmount: true },
            },
          },
        },
      },
    });

    // Aggregate revenue and stats per host
    const hostsData = topHosts.map((host) => {
      const allBookings = host.properties.flatMap((p) => p.bookings);
      const totalEarnings = allBookings.reduce(
        (sum, b) => sum + (b.totalAmount || 0),
        0
      );
      const totalBookings = allBookings.length;
      const allRatings = host.properties
        .map((p) => p.avgRating)
        .filter((r) => r != null);
      const avgRating =
        allRatings.length > 0
          ? allRatings.reduce((a, b) => a + b, 0) / allRatings.length
          : 0;

      return {
        id: host.id,
        name: host.name,
        email: host.email,
        totalEarnings,
        totalBookings,
        avgRating: Number(avgRating.toFixed(1)),
      };
    });

    // Sort & return top 5
    const sorted = hostsData
      .sort((a, b) => b.totalEarnings - a.totalEarnings)
      .slice(0, 5);

    res.json(sorted);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Failed to fetch top hosts", detail: err.message });
  }
}

/**
 * GET /api/admin/top-properties
 * Returns top 5 properties ranked by total revenue.
 */
export async function getTopProperties(req, res) {
  try {
    // Fetch all properties with their successful bookings
    const properties = await prisma.property.findMany({
      select: {
        id: true,
        title: true,
        city: true,
        avgRating: true,
        host: { select: { id: true, email: true, name: true } },
        bookings: {
          where: { paymentStatus: "SUCCESS" },
          select: { totalAmount: true },
        },
      },
    });

    // Compute revenue & booking count per property
    const propertyStats = properties.map((p) => {
      const totalRevenue = p.bookings.reduce(
        (sum, b) => sum + (b.totalAmount || 0),
        0
      );
      const totalBookings = p.bookings.length;

      return {
        id: p.id,
        title: p.title,
        city: p.city,
        hostEmail: p.host?.email || null,
        totalRevenue,
        totalBookings,
        avgRating: Number(p.avgRating?.toFixed(1) || 0),
      };
    });

    // Sort by totalRevenue desc and take top 5
    const top5 = propertyStats
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 5);

    res.json(top5);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Failed to fetch top properties", detail: err.message });
  }
}