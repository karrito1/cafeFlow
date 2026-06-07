const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Rutas
app.use('/api/auth',      require('./routes/auth.routes'));
app.use('/api/usuarios',  require('./routes/usuario.routes'));
app.use('/api/productos', require('./routes/producto.routes'));
app.use('/api/mesas',     require('./routes/mesa.routes'));
app.use('/api/pedidos',   require('./routes/pedido.routes'));
app.use('/api/pagos',     require('./routes/pago.routes'));
app.use('/api/clientes',  require('./routes/cliente.routes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', mensaje: 'CaféFlow API funcionando' });
});

module.exports = app;