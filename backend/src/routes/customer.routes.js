const router = require('express').Router();
const {
  registerCustomer,
  getCustomers,
  getCustomer,
} = require('../controllers/customer.controller');

router.post('/',   registerCustomer);
router.get('/',    getCustomers);
router.get('/:id', getCustomer);

module.exports = router;