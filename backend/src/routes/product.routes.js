const router = require('express').Router();
const { verifyToken, onlyRole } = require('../middlewares/auth');
const { handleValidationErrors } = require('../middlewares/validate');
const { validateCreateProduct } = require('../validators/product.validator');
const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/product.controller');

// Public routes - anyone can view products
router.get('/', getProducts);
router.get('/:id', getProduct);

// Protected routes - only admin
router.post('/',    verifyToken, onlyRole('admin'), validateCreateProduct, handleValidationErrors, createProduct);
router.put('/:id',  verifyToken, onlyRole('admin'), updateProduct);
router.delete('/:id', verifyToken, onlyRole('admin'), deleteProduct);

module.exports = router;