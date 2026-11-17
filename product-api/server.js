require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Product = require("./models/Product");
const auth = require("./middleware/auth");
const authorize = require("./middleware/authorize");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const roleRoutes = require("./routes/roles");
const { PERMISSIONS: P } = require("./config/permissions");

const app = express();
app.use(cors()); 
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err.message));

app.use("/auth", authRoutes);          
app.use("/products", auth);            
app.use("/users", auth, userRoutes);   
app.use("/roles", auth, roleRoutes);

async function productExists(name, category, excludeId) {
  const filter = { name, category };
  if (excludeId) {
    filter._id = { $ne: excludeId };
  }
  const found = await Product.findOne(filter).collation({ locale: "en", strength: 2 });
  return found !== null;
}

function pickProductFields(body) {
  const fields = {};
  for (const key of ["name", "category", "price", "qty"]) {
    if (body[key] !== undefined) {
      fields[key] = body[key];
    }
  }
  return fields;
}

app.get("/products", authorize(P.PRODUCT_VIEW), async (req, res) => {
  try {
    res.json(await Product.find().populate("createdBy", "name"));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/products/:id", authorize(P.PRODUCT_VIEW), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("createdBy", "name");
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: "Invalid id" });
  }
});

app.post("/products", authorize(P.PRODUCT_CREATE), async (req, res) => {
  try {
    const fields = pickProductFields(req.body);
    if (fields.name && fields.category && (await productExists(String(fields.name).trim(), fields.category))) {
      return res.status(400).json({ error: "Product already exists" });
    }

    const product = await Product.create({ ...fields, createdBy: req.user.id });
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put("/products/:id", authorize(P.PRODUCT_EDIT), async (req, res) => {
  try {
    const fields = pickProductFields(req.body);
    if (
      fields.name &&
      fields.category &&
      (await productExists(String(fields.name).trim(), fields.category, req.params.id))
    ) {
      return res.status(400).json({ error: "Product already exists" });
    }

    const product = await Product.findByIdAndUpdate(req.params.id, fields, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/products/:id", authorize(P.PRODUCT_DELETE), async (req, res) => {
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