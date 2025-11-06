const PDFDocument = require('pdfkit');

/**
 * Generate a transaction receipt PDF for a payment
 * @param {Object} paymentData - Payment and booking details
 * @param {string} paymentData.propertyName - Name of the property
 * @param {Date} paymentData.checkIn - Check-in date
 * @param {Date} paymentData.checkOut - Check-out date
 * @param {string} paymentData.paymentReference - Payment reference ID
 * @param {number} paymentData.amount - Amount paid (in kobo)
 * @param {string} paymentData.currency - Currency code (e.g., 'NGN')
 * @param {Date} paymentData.paidAt - Payment date
 * @param {string} paymentData.status - Payment status (SUCCESS/FAILED)
 * @param {string} paymentData.guestEmail - Guest email address
 * @param {string} paymentData.guestName - Guest name (optional)
 * @returns {PDFDocument} - PDF document stream
 */
function generateTransactionReceipt(paymentData) {
  const doc = new PDFDocument({
    size: 'A4',
    margin: 50,
    info: {
      Title: `Receipt - ${paymentData.paymentReference}`,
      Author: 'Averulo',
      Subject: 'Payment Receipt'
    }
  });

  // Helper function to format currency
  const formatCurrency = (amountInKobo, currency) => {
    const amount = amountInKobo / 100;
    return `${currency} ${amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Helper function to format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Colors
  const primaryColor = '#2563eb'; // Blue
  const successColor = '#16a34a'; // Green
  const failedColor = '#dc2626'; // Red
  const grayColor = '#6b7280';
  const lightGray = '#e5e7eb';

  // Header - Company Logo and Name
  doc
    .fontSize(28)
    .fillColor(primaryColor)
    .text('Averulo', 50, 50)
    .fontSize(10)
    .fillColor(grayColor)
    .text('Property Booking Platform', 50, 85);

  // Receipt Title
  doc
    .fontSize(20)
    .fillColor('#111827')
    .text('TRANSACTION RECEIPT', 50, 130, { align: 'center' });

  // Status Badge
  const statusColor = paymentData.status === 'SUCCESS' ? successColor : failedColor;
  const statusText = paymentData.status === 'SUCCESS' ? '✓ PAYMENT SUCCESS' : '✗ PAYMENT FAILED';

  doc
    .fontSize(12)
    .fillColor(statusColor)
    .text(statusText, 50, 165, { align: 'center' });

  // Divider Line
  doc
    .moveTo(50, 195)
    .lineTo(545, 195)
    .strokeColor(lightGray)
    .stroke();

  // Payment Details Section
  let yPosition = 220;

  doc
    .fontSize(12)
    .fillColor('#111827')
    .text('Payment Information', 50, yPosition, { underline: true });

  yPosition += 25;

  // Payment Reference
  doc
    .fontSize(10)
    .fillColor(grayColor)
    .text('Payment Reference:', 50, yPosition)
    .fillColor('#111827')
    .text(paymentData.paymentReference, 200, yPosition);

  yPosition += 20;

  // Payment Date
  doc
    .fillColor(grayColor)
    .text('Payment Date:', 50, yPosition)
    .fillColor('#111827')
    .text(formatDate(paymentData.paidAt), 200, yPosition);

  yPosition += 20;

  // Guest Email
  doc
    .fillColor(grayColor)
    .text('Guest Email:', 50, yPosition)
    .fillColor('#111827')
    .text(paymentData.guestEmail, 200, yPosition);

  yPosition += 35;

  // Booking Details Section
  doc
    .fontSize(12)
    .fillColor('#111827')
    .text('Booking Details', 50, yPosition, { underline: true });

  yPosition += 25;

  // Property Name
  doc
    .fontSize(10)
    .fillColor(grayColor)
    .text('Property:', 50, yPosition)
    .fillColor('#111827')
    .text(paymentData.propertyName, 200, yPosition, { width: 345 });

  yPosition += 20;

  // Check-in Date
  doc
    .fillColor(grayColor)
    .text('Check-in:', 50, yPosition)
    .fillColor('#111827')
    .text(formatDate(paymentData.checkIn), 200, yPosition);

  yPosition += 20;

  // Check-out Date
  doc
    .fillColor(grayColor)
    .text('Check-out:', 50, yPosition)
    .fillColor('#111827')
    .text(formatDate(paymentData.checkOut), 200, yPosition);

  yPosition += 20;

  // Calculate nights
  const nights = Math.ceil((new Date(paymentData.checkOut) - new Date(paymentData.checkIn)) / (1000 * 60 * 60 * 24));
  doc
    .fillColor(grayColor)
    .text('Duration:', 50, yPosition)
    .fillColor('#111827')
    .text(`${nights} night${nights > 1 ? 's' : ''}`, 200, yPosition);

  yPosition += 35;

  // Amount Section with Background
  doc
    .rect(50, yPosition, 495, 60)
    .fillColor('#f3f4f6')
    .fill();

  yPosition += 20;

  doc
    .fontSize(12)
    .fillColor(grayColor)
    .text('Total Amount Paid:', 70, yPosition)
    .fontSize(18)
    .fillColor(primaryColor)
    .text(formatCurrency(paymentData.amount, paymentData.currency), 70, yPosition + 20);

  yPosition += 75;

  // Divider Line
  doc
    .moveTo(50, yPosition)
    .lineTo(545, yPosition)
    .strokeColor(lightGray)
    .stroke();

  yPosition += 20;

  // Footer - Contact Information
  doc
    .fontSize(9)
    .fillColor(grayColor)
    .text('For any inquiries, please contact us:', 50, yPosition, { align: 'center' })
    .text('Email: support@averulo.com | Phone: +234 800 000 0000', 50, yPosition + 15, { align: 'center' })
    .text('Website: www.averulo.com', 50, yPosition + 30, { align: 'center' });

  yPosition += 65;

  // Thank you message
  doc
    .fontSize(10)
    .fillColor('#111827')
    .text('Thank you for booking with Averulo!', 50, yPosition, { align: 'center', italic: true });

  // Footer note
  doc
    .fontSize(8)
    .fillColor(grayColor)
    .text('This is a computer-generated receipt and does not require a signature.', 50, 750, {
      align: 'center',
      width: 495
    });

  // Finalize PDF
  doc.end();

  return doc;
}

module.exports = { generateTransactionReceipt };
