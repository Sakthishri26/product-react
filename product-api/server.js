require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Product = require("./models/Product");

const app = express();
app.use(cors());
app.use(express.json());


async function productExists(name, category, excludeId) {
  const filter = { name, category };
  if (excludeId) {
    filter._id = { $ne: excludeId };
  }
  const found = await Product.findOne(filter).collation({
    locale: "en",
    strength: 2,
  });
  return found !== null;
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err.message));

app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: "Invalid id" });
  }
});
app.post("/products", async (req, res) => {
  try {
    
    const { name, category } = req.body;
    if (name && category && (await productExists(String(name).trim(), category))) {
      return res.status(400).json({ error: "Product already exists" });
    }

    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put("/products/:id", async (req, res) => {
  try {
    const { name, category } = req.body;
    if (
      name &&
      category &&
      (await productExists(String(name).trim(), category, req.params.id))
    ) {
      return res.status(400).json({ error: "Product already exists" });
    }

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/products/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(400).json({ error: "Invalid id" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));