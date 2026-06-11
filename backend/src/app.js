const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
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

module.exports = app;
