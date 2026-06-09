const router = require('express').Router();
const { getPayments, getPaymentById, createPayment } = require('../controllers/payment.controller');

router.get('/', getPayments);
router.get('/:id', getPaymentById);
router.post('/', createPayment);

module.exports = router;