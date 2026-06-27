const router = require('express').Router();
const { handleValidationErrors } = require('../middlewares/validate');
const { validateCreateCustomer } = require('../validators/customer.validator');
const {
  registerCustomer,
  getCustomers,
  getCustomer,
} = require('../controllers/customer.controller');

router.post('/',   validateCreateCustomer, handleValidationErrors, registerCustomer);
router.get('/',    getCustomers);
router.get('/:id', getCustomer);

module.exports = router;