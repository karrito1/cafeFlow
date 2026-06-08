require('dotenv').config();
const bcrypt = require('bcryptjs');
const conectarDB = require('./config/db');
const Customer = require('./models/Customer');

const seed = async () => {
  await conectarDB();

  await Customer.deleteMany();
  console.log('🗑️ Customers deleted');

  await Customer.insertMany([
    {
      nombre:     'Juan Pérez',
      email:    'juan@gmail.com',
      telefono: '3001234567',
      password: await bcrypt.hash('cliente123', 12),
      puntos:   150,
      nivel:    'silver',
      status:   true,
    },
    {
      nombre:     'María López',
      email:    'maria@gmail.com',
      telefono: '3009876543',
      password: await bcrypt.hash('cliente123', 12),
      puntos:   50,
      nivel:    'bronze',
      status:   true,
    },
  ]);

  console.log('👥 Customers created');
  console.log('✅ Seed completed');
  process.exit(0);
};

seed().catch((err) => {
  console.error('❌ Error:', err);
  process.exit(1);
});