const router = require('express').Router();
const { verifyToken, onlyRole } = require('../middlewares/auth');
const { getPayments, getPaymentById, createPayment } = require('../controllers/payment.controller');

router.get('/',     verifyToken, onlyRole('admin'), getPayments);
router.get('/:id',  verifyToken, onlyRole('admin'), getPaymentById);
router.post('/',    verifyToken, onlyRole('admin'), createPayment);

module.exports = router;