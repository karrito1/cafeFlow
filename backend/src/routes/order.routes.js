const router = require('express').Router();
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder
} = require('../controllers/order.controller');

router.post('/',           createOrder);
router.get('/',            getOrders);
router.get('/:id',         getOrderById);
router.put('/:id',         updateOrder);
// router.put('/:id/confirm', confirmOrder);

module.exports = router;