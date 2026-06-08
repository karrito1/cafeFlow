const router = require('express').Router();
const {
  registrarCliente,
  getClientes,
  getCliente,
} = require('../controllers/cliente.controller');

router.post('/',   registrarCliente);
router.get('/',    getClientes);
router.get('/:id', getCliente);

module.exports = router;