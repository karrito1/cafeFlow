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

router.post('/',    verifyToken, onlyRole('admin'), validateCreateOrder, handleValidationErrors, createOrder);
router.get('/',     verifyToken, onlyRole('admin'), getOrders);
router.get('/:id',  verifyToken, onlyRole('admin'), getOrderById);
router.put('/:id',  verifyToken, onlyRole('admin'), updateOrder);

module.exports = router;