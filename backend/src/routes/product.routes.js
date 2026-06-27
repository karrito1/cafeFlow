const router = require('express').Router();
const { verifyToken, onlyRole } = require('../middlewares/auth');
const { handleValidationErrors } = require('../middlewares/validate');
const { validateCreateProduct } = require('../validators/product.validator');
const upload = require('../middlewares/upload');
const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} = require('../controllers/product.controller');

// Public routes - anyone can view products
router.get('/', getProducts);
router.get('/:id', getProduct);

// Protected routes - only admin
router.post('/',    verifyToken, onlyRole('admin'), validateCreateProduct, handleValidationErrors, createProduct);
router.put('/:id',  verifyToken, onlyRole('admin'), updateProduct);
router.delete('/:id', verifyToken, onlyRole('admin'), deleteProduct);
router.put('/:id/image', verifyToken, onlyRole('admin'), upload.single('image'), uploadImage);

module.exports = router;