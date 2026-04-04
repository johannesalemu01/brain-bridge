const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { protect } = require('../middleware/auth.middleware');

// Protected route for initializing a checkout session
router.post('/checkout', protect, paymentController.initializeCheckout);

// Public webhook route for payment providers
router.post('/webhook', paymentController.paymentWebhook);

module.exports = router;
