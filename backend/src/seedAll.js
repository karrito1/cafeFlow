require("dotenv").config();
const conectarDB = require("./config/db");
const Category = require("./models/Category");
const Product = require("./models/Product");
const Table = require("./models/Table");

const categories = [
  { name: "Cafés", description: "Bebidas de café", order: 1 },
  { name: "Tés", description: "Bebidas de té", order: 2 },
  { name: "Fríos", description: "Bebidas frías", order: 3 },
  { name: "Repostería", description: "Panadería y dulces", order: 4 },
  { name: "Snacks", description: "Aperitivos y bocadillos", order: 5 },
];

const tables = [
  { tableNumber: 1, name: "Terraza 1", capacity: 4 },
  { tableNumber: 2, name: "Terraza 2", capacity: 4 },
  { tableNumber: 3, name: "Terraza 3", capacity: 2 },
  { tableNumber: 4, name: "Interior 1", capacity: 6 },
  { tableNumber: 5, name: "Interior 2", capacity: 4 },
  { tableNumber: 6, name: "Interior 3", capacity: 2 },
  { tableNumber: 7, name: "Ventana", capacity: 2 },
  { tableNumber: 8, name: "Barra", capacity: 3 },
];

const productsByCategory = {
  Cafés: [
    { name: "Espresso", description: "Café espresso puro y fuerte", price: { M: 4500 }, stock: 100, featured: true },
    { name: "Americano", description: "Café suave con agua caliente", price: { M: 4000 }, stock: 100 },
    { name: "Cappuccino", description: "Espresso con espuma de leche", price: { S: 5000, M: 6000, L: 7000 }, stock: 100, featured: true },
    { name: "Latte", description: "Café con leche cremosa", price: { S: 5500, M: 6500, L: 7500 }, stock: 100 },
    { name: "Mocha", description: "Espresso con chocolate y leche", price: { S: 6000, M: 7000, L: 8000 }, stock: 80 },
    { name: "Macchiato", description: "Espresso manchado con espuma", price: { M: 5500 }, stock: 90 },
    { name: "Flat White", description: "Doble espresso con leche microfoam", price: { M: 6500 }, stock: 70, featured: true },
  ],
  Tés: [
    { name: "Té Verde", description: "Té verde japonés", price: { M: 4000 }, stock: 60 },
    { name: "Té Negro", description: "Té negro clásico", price: { M: 3500 }, stock: 60 },
    { name: "Chai Latte", description: "Té chai especiado con leche", price: { S: 5000, M: 6000 }, stock: 50, featured: true },
    { name: "Manzanilla", description: "Infusión de manzanilla natural", price: { M: 3500 }, stock: 40 },
  ],
  Fríos: [
    { name: "Cold Brew", description: "Café frío infusionado 12 horas", price: { M: 6000, L: 7500 }, stock: 50, featured: true },
    { name: "Frappé de Café", description: "Café licuado con hielo y crema", price: { S: 7000, M: 8000, L: 9000 }, stock: 50 },
    { name: "Limonada Natural", description: "Limonada fresca con hielo", price: { M: 4000 }, stock: 40 },
    { name: "Jugo de Naranja", description: "Jugo de naranja recién exprimido", price: { M: 5000 }, stock: 30 },
  ],
  Repostería: [
    { name: "Croissant", description: "Croissant de mantequilla recién horneado", price: { M: 4500 }, stock: 30, featured: true },
    { name: "Muffin de Arándanos", description: "Muffin jugoso con arándanos frescos", price: { M: 5000 }, stock: 25 },
    { name: "Brownie", description: "Brownie de chocolate intenso", price: { M: 5500 }, stock: 20 },
    { name: "Tostada con Aguacate", description: "Pan tostado con aguacate y tomate", price: { M: 7000 }, stock: 25 },
    { name: "Pan de Chocolate", description: "Pan dulce relleno de chocolate", price: { M: 4000 }, stock: 20 },
  ],
  Snacks: [
    { name: "Galletas de Avena", description: "Pack de 3 galletas de avena caseras", price: { M: 3500 }, stock: 30 },
    { name: "Barra Granola", description: "Barra de granola con frutos secos", price: { M: 4000 }, stock: 25 },
    { name: "Empanada", description: "Empanada de pollo o queso", price: { M: 5000 }, stock: 20 },
  ],
};

const seed = async () => {
  await conectarDB();

  // Categories
  await Category.deleteMany();
  console.log("Categorías eliminadas");
  const createdCategories = await Category.insertMany(categories);
  console.log(`${createdCategories.length} categorías creadas`);

  // Tables
  await Table.deleteMany();
  console.log("Mesas eliminadas");
  const createdTables = await Table.insertMany(tables);
  console.log(`${createdTables.length} mesas creadas`);

  // Products
  await Product.deleteMany();
  console.log("Productos eliminados");
  let totalProducts = 0;
  for (const cat of createdCategories) {
    const items = productsByCategory[cat.name] || [];
    const products = items.map((p) => ({ ...p, categoryId: cat._id }));
    await Product.insertMany(products);
    totalProducts += products.length;
  }
  console.log(`${totalProducts} productos creados`);

  console.log("Seed completado");
  process.exit(0);
};

seed().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
