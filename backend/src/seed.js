require("dotenv").config();
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const Customer = require("./models/Customer");

const seed = async () => {
  await connectDB();

  await Customer.deleteMany();
  console.log("🗑️ Customers deleted");

  await Customer.insertMany([
    {
      name: "Juan Pérez",
      email: "juan@gmail.com",
      phone: "3001234567",
      password: await bcrypt.hash("cliente123", 12),
      points: 150,
      level: "silver",
      active: true,
    },
    {
      name: "María López",
      email: "maria@gmail.com",
      phone: "3009876543",
      password: await bcrypt.hash("cliente123", 12),
      points: 50,
      level: "bronze",
      active: true,
    },
  ]);

  console.log("👥 Customers created");
  console.log("✅ Seed completed");
  process.exit(0);
};

seed().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
