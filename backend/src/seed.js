const bcrypt = require("bcryptjs");
const conectarDB = require("./config/db");
const Cliente = require("./models/Customer");

const seed = async () => {
  await conectarDB();

  await Cliente.deleteMany();
  console.log("🗑️ Clientes limpiados");

  await Cliente.insertMany([
    {
      nombre: "Juan Pérez",
      email: "juan@gmail.com",
      telefono: "3001234567",
      password: await bcrypt.hash("cliente123", 12),
      puntos: 150,
      nivel: "plata",
    },
    {
      nombre: "María López",
      email: "maria@gmail.com",
      telefono: "3009876543",
      password: await bcrypt.hash("cliente123", 12),
      puntos: 50,
      nivel: "bronce",
    },
  ]);

  console.log(" Clientes creados");
  console.log(" Seed completado");
  process.exit(0);
};

seed().catch((err) => {
  console.error(" Error:", err);
  process.exit(1);
});
