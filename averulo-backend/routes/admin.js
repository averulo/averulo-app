const express = require('express');
const { verifyToken, requireRole } = require('../middleware/auth');
const { sendBookingReminders, previewBookingReminders } = require('../jobs/bookingReminder');

const router = express.Router();

/**
 * GET /api/admin/run-reminders
 * Manually trigger the booking reminder job
 * Requires: Valid JWT with ADMIN role
 */
router.get('/run-reminders', verifyToken, requireRole('ADMIN'), async (req, res) => {
  try {
    console.log(`[Admin] Booking reminder job triggered by user ${req.user.email}`);

    const result = await sendBookingReminders();

    return res.json({
      success: result.success,
      message: 'Booking reminder job completed',
      results: {
        scanned: result.scanned,
        created: result.created,
        skipped: result.skipped,
        errors: result.errors,
        duration: `${result.duration}ms`
      },
      errorDetails: result.errorDetails || []
    });

  } catch (error) {
    console.error('[Admin] Error running reminder job:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to run booking reminder job',
      details: error.message
    });
  }
});

/**
 * GET /api/admin/preview-reminders
 * Preview which bookings would receive reminders (without sending)
 * Requires: Valid JWT with ADMIN role
 */
router.get('/preview-reminders', verifyToken, requireRole('ADMIN'), async (req, res) => {
  try {
    const bookings = await previewBookingReminders();

    return res.json({
      success: true,
      count: bookings.length,
      bookings
    });

  } catch (error) {
    console.error('[Admin] Error previewing reminders:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to preview booking reminders',
      details: error.message
    });
  }
});

/**
 * GET /api/admin/stats
 * Get system statistics
 * Requires: Valid JWT with ADMIN role
 */
router.get('/stats', verifyToken, requireRole('ADMIN'), async (req, res) => {
  try {
    const { prisma } = require('../lib/prisma');

    const [
      totalUsers,
      totalProperties,
      totalBookings,
      totalPayments,
      totalNotifications,
      pendingBookings,
      successfulPayments
    ] = await Promise.all([
      prisma.user.count(),
      prisma.property.count(),
      prisma.booking.count(),
      prisma.payment.count(),
      prisma.notification.count(),
      prisma.booking.count({ where: { status: 'PENDING' } }),
      prisma.payment.count({ where: { status: 'SUCCESS' } })
    ]);

    return res.json({
      success: true,
      stats: {
        users: totalUsers,
        properties: totalProperties,
        bookings: {
          total: totalBookings,
          pending: pendingBookings
        },
        payments: {
          total: totalPayments,
          successful: successfulPayments
        },
        notifications: totalNotifications
      }
    });

  } catch (error) {
    console.error('[Admin] Error fetching stats:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch system statistics'
    });
  }
});

module.exports = router;
