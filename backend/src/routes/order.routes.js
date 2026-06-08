const router = require('express').Router();
const {
  createOrder,
  getOrders,
  getOrder,
  updateOrder,
  confirmOrder,
} = require('../controllers/order.controller');

router.post('/',           createOrder);
router.get('/',            getOrders);
router.get('/:id',         getOrder);
router.put('/:id',         updateOrder);
router.put('/:id/confirm', confirmOrder);

module.exports = router;