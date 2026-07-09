const router = require('express').Router();
const { verifyToken, onlyRole } = require('../middlewares/auth');
const { handleValidationErrors } = require('../middlewares/validate');
const { validateCreateOrder } = require('../validators/order.validator');
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder
} = require('../controllers/order.controller');

router.post('/',    verifyToken, onlyRole('admin', 'waiter'), validateCreateOrder, handleValidationErrors, createOrder);
router.get('/',     verifyToken, onlyRole('admin', 'waiter'), getOrders);
router.get('/:id',  verifyToken, onlyRole('admin', 'waiter'), getOrderById);
router.put('/:id',  verifyToken, onlyRole('admin', 'waiter'), updateOrder);

module.exports = router;