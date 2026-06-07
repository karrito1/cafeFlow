const app = require('./src/app');
const conectarDB = require('./src/config/db');
require('dotenv').config();

conectarDB();

app.listen(process.env.PORT, () => {
  console.log(` Servidor corriendo en puerto ${process.env.PORT}`);
});