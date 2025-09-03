const router = require('express').Router();

// stub endpoint so server boots
router.get('/', (req, res) => {
  res.json([
    { id: 'property_seed_1', title: 'Cozy 1BR near Eko Hotel', city: 'Lagos', price: 350000, status: 'ACTIVE' }
  ]);
});

module.exports = router;