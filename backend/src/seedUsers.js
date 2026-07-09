require('dotenv').config();
const bcrypt = require('bcryptjs');
const conectarDB = require('./config/db');
const User = require('./models/User');

const seed = async () => {
  await conectarDB();

  await User.deleteMany();
  console.log(' Users deleted');

  await User.insertMany([
    {
      name:     'Admin CaféFlow',
      email:    'admin@cafeflow.com',
      password: await bcrypt.hash('admin123', 12),
      role:     'admin',
    },
    {
      name:     'Mesero 1',
      email:    'mesero@cafeflow.com',
      password: await bcrypt.hash('mesero123', 12),
      role:     'waiter',
    },
  ]);

  console.log(' Users created');
  console.log(' Seed completed');
  process.exit(0);
};

seed().catch((err) => {
  console.error(' Error:', err);
  process.exit(1);
});