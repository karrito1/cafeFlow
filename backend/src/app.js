const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const YAML = require("js-yaml");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      process.env.FRONTEND_URL,
    ].filter(Boolean),
  }),
);
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/products", require("./routes/product.routes"));
app.use("/api/tables", require("./routes/table.routes"));
app.use("/api/orders", require("./routes/order.routes"));
app.use("/api/payments", require("./routes/payment.routes"));
app.use("/api/customers", require("./routes/customer.routes"));
app.use("/api/categories", require("./routes/category.routes"));
app.use("/api/rewards", require("./routes/reward.routes"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "CaféFlow API running" });
});

// Documentación Swagger
const swaggerDocument = YAML.load(
  fs.readFileSync(path.join(__dirname, "../openapi.yaml"), "utf8")
);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../../frontend/dist");
  app.use(express.static(frontendPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

module.exports = app;