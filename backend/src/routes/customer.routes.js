const router = require('express').Router();
const { handleValidationErrors } = require('../middlewares/validate');
const { validateCreateCustomer } = require('../validators/customer.validator');
const {
  registerCustomer,
  getCustomers,
  getCustomer,
  deleteCustomer,
} = require('../controllers/customer.controller');

router.post('/',    validateCreateCustomer, handleValidationErrors, registerCustomer);
router.get('/',    getCustomers);
router.get('/:id', getCustomer);
router.delete('/:id', deleteCustomer);

module.exports = router;