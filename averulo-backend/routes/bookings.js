const router = require('express').Router();

router.post('/', (req, res) => {
  const { propertyId, checkIn, checkOut } = req.body || {};
  res.status(201).json({
    id: 'booking-123',
    propertyId,
    checkIn,
    checkOut,
    amount: 350000,
    currency: 'NGN',
    status: 'PENDING'
  });
});

module.exports = router;