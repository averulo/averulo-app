const express = require('express');
const { prisma } = require('../lib/prisma');
const { verifyToken } = require('../middleware/auth');
const { generateTransactionReceipt } = require('../services/pdfGenerator');

const router = express.Router();

/**
 * GET /api/payments/:id/receipt
 * Generate and download a PDF receipt for a payment
 * Requires: Valid JWT (USER or HOST)
 */
router.get('/:id/receipt', verifyToken, async (req, res) => {
  try {
    const { id: paymentId } = req.params;
    const userId = req.user.id;

    // Fetch payment with related booking, property, and guest info
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        booking: {
          include: {
            property: {
              select: {
                title: true,
                hostId: true
              }
            },
            guest: {
              select: {
                id: true,
                email: true
              }
            }
          }
        },
        user: {
          select: {
            id: true,
            email: true,
            role: true
          }
        }
      }
    });

    // Check if payment exists
    if (!payment) {
      return res.status(404).json({
        error: 'Payment not found.'
      });
    }

    // Authorization check: user must be the payment owner or the property host
    const isPaymentOwner = payment.userId === userId;
    const isPropertyHost = payment.booking.property.hostId === userId;

    if (!isPaymentOwner && !isPropertyHost) {
      return res.status(403).json({
        error: 'You do not have permission to access this receipt.'
      });
    }

    // Prepare payment data for PDF generation
    const paymentData = {
      propertyName: payment.booking.property.title,
      checkIn: payment.booking.checkIn,
      checkOut: payment.booking.checkOut,
      paymentReference: payment.paymentReference,
      amount: payment.amount,
      currency: payment.currency,
      paidAt: payment.paidAt || payment.createdAt,
      status: payment.status,
      guestEmail: payment.booking.guest.email
    };

    // Generate PDF
    const pdfDoc = generateTransactionReceipt(paymentData);

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="receipt-${payment.paymentReference}.pdf"`
    );

    // Pipe the PDF to the response
    pdfDoc.pipe(res);

    // Log successful receipt generation
    console.log(`Receipt generated for payment ${paymentId} by user ${userId}`);

  } catch (error) {
    console.error('Error generating receipt:', error);

    // Handle specific Prisma errors
    if (error.code === 'P2025') {
      return res.status(404).json({
        error: 'Payment not found.'
      });
    }

    return res.status(500).json({
      error: 'Failed to generate receipt. Please try again later.'
    });
  }
});

/**
 * GET /api/payments/:id
 * Get payment details by ID
 * Requires: Valid JWT
 */
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const { id: paymentId } = req.params;
    const userId = req.user.id;

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        booking: {
          include: {
            property: {
              select: {
                id: true,
                title: true,
                hostId: true
              }
            }
          }
        }
      }
    });

    if (!payment) {
      return res.status(404).json({
        error: 'Payment not found.'
      });
    }

    // Authorization check
    const isPaymentOwner = payment.userId === userId;
    const isPropertyHost = payment.booking.property.hostId === userId;

    if (!isPaymentOwner && !isPropertyHost) {
      return res.status(403).json({
        error: 'You do not have permission to view this payment.'
      });
    }

    return res.json({ payment });

  } catch (error) {
    console.error('Error fetching payment:', error);
    return res.status(500).json({
      error: 'Failed to fetch payment details.'
    });
  }
});

/**
 * GET /api/payments
 * Get all payments for the logged-in user
 * Requires: Valid JWT
 */
router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const payments = await prisma.payment.findMany({
      where: { userId },
      include: {
        booking: {
          include: {
            property: {
              select: {
                id: true,
                title: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return res.json({ payments });

  } catch (error) {
    console.error('Error fetching payments:', error);
    return res.status(500).json({
      error: 'Failed to fetch payments.'
    });
  }
});

module.exports = router;
