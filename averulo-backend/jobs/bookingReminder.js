const { prisma } = require('../lib/prisma');

/**
 * Send reminder notifications for bookings starting within the next 24 hours
 *
 * This job should be run once daily (or can be triggered manually via endpoint)
 * It scans for bookings that:
 * - Have a start date within the next 24 hours
 * - Have payment status = SUCCESS
 * - Have booking status = APPROVED
 *
 * @returns {Object} Result summary with counts
 */
async function sendBookingReminders() {
  const startTime = Date.now();
  const results = {
    scanned: 0,
    created: 0,
    skipped: 0,
    errors: 0,
    errorDetails: []
  };

  try {
    // Calculate time window: now + 24 hours (with 1-hour buffer on each side)
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000); // +24 hours
    const windowStart = new Date(now.getTime() + 23 * 60 * 60 * 1000); // +23 hours
    const windowEnd = new Date(now.getTime() + 25 * 60 * 60 * 1000); // +25 hours

    console.log(`[BookingReminder] Scanning bookings between ${windowStart.toISOString()} and ${windowEnd.toISOString()}`);

    // Find eligible bookings
    const eligibleBookings = await prisma.booking.findMany({
      where: {
        checkIn: {
          gte: windowStart,
          lte: windowEnd
        },
        paymentStatus: 'SUCCESS',
        status: 'APPROVED'
      },
      include: {
        property: {
          select: {
            title: true
          }
        },
        guest: {
          select: {
            id: true,
            email: true
          }
        }
      }
    });

    results.scanned = eligibleBookings.length;
    console.log(`[BookingReminder] Found ${results.scanned} eligible bookings`);

    // Process each booking
    for (const booking of eligibleBookings) {
      try {
        // Check if notification already exists for this booking
        const existingNotification = await prisma.notification.findUnique({
          where: {
            bookingId_type: {
              bookingId: booking.id,
              type: 'BOOKING_STATUS'
            }
          }
        });

        if (existingNotification) {
          console.log(`[BookingReminder] Notification already exists for booking ${booking.id}, skipping`);
          results.skipped++;
          continue;
        }

        // Calculate hours until check-in
        const hoursUntilCheckIn = Math.round((booking.checkIn - now) / (1000 * 60 * 60));

        // Create notification
        await prisma.notification.create({
          data: {
            userId: booking.guestId,
            bookingId: booking.id,
            type: 'BOOKING_STATUS',
            title: 'Your stay starts soon 🏡',
            body: `Reminder: Your booking for ${booking.property.title} starts in approximately ${hoursUntilCheckIn} hours.`,
            read: false
          }
        });

        console.log(`[BookingReminder] Created notification for booking ${booking.id} (Guest: ${booking.guest.email})`);
        results.created++;

      } catch (error) {
        console.error(`[BookingReminder] Error processing booking ${booking.id}:`, error);
        results.errors++;
        results.errorDetails.push({
          bookingId: booking.id,
          error: error.message
        });
      }
    }

    const duration = Date.now() - startTime;
    console.log(`[BookingReminder] Job completed in ${duration}ms`);
    console.log(`[BookingReminder] Summary: ${results.created} created, ${results.skipped} skipped, ${results.errors} errors`);

    return {
      success: true,
      duration,
      ...results
    };

  } catch (error) {
    console.error('[BookingReminder] Fatal error:', error);
    return {
      success: false,
      error: error.message,
      ...results
    };
  }
}

/**
 * Optional: Get upcoming bookings that need reminders (preview without sending)
 * @returns {Array} List of bookings that would receive reminders
 */
async function previewBookingReminders() {
  try {
    const now = new Date();
    const windowStart = new Date(now.getTime() + 23 * 60 * 60 * 1000);
    const windowEnd = new Date(now.getTime() + 25 * 60 * 60 * 1000);

    const eligibleBookings = await prisma.booking.findMany({
      where: {
        checkIn: {
          gte: windowStart,
          lte: windowEnd
        },
        paymentStatus: 'SUCCESS',
        status: 'APPROVED'
      },
      include: {
        property: {
          select: {
            id: true,
            title: true
          }
        },
        guest: {
          select: {
            id: true,
            email: true
          }
        },
        notifications: {
          where: {
            type: 'BOOKING_STATUS'
          }
        }
      }
    });

    return eligibleBookings.map(booking => ({
      bookingId: booking.id,
      propertyTitle: booking.property.title,
      guestEmail: booking.guest.email,
      checkIn: booking.checkIn,
      hasNotification: booking.notifications.length > 0,
      hoursUntilCheckIn: Math.round((booking.checkIn - now) / (1000 * 60 * 60))
    }));

  } catch (error) {
    console.error('[BookingReminder] Error previewing reminders:', error);
    throw error;
  }
}

module.exports = {
  sendBookingReminders,
  previewBookingReminders
};
