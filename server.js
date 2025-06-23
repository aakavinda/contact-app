// server.js (MongoDB + Mongoose + .env version)
require("dotenv").config(); // ✅ Load environment variables

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ✅ Load MongoDB URI from .env
const MONGODB_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Mongoose schema and model
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

const Contact = mongoose.model("Contact", contactSchema);

// ✅ Add new entry
app.post("/api/contact", async (req, res) => {
  try {
    const contact = new Contact(req.body);
    const saved = await contact.save();
    res.json({ message: `Hi ${saved.name}, your data was saved!`, id: saved._id });
  } catch (err) {
    console.error("❌ Insert error:", err);
    res.status(500).json({ message: "Database error" });
  }
});

// ✅ Get all entries
app.get("/api/names", async (req, res) => {
  try {
    const entries = await Contact.find().sort({ created_at: -1 });
    res.json(entries);
  } catch (err) {
    console.error("❌ Fetch error:", err);
    res.status(500).json({ message: "Database error" });
  }
});

// ✅ Delete entry by ID
app.delete("/api/names/:id", async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: "Entry deleted successfully" });
  } catch (err) {
    console.error("❌ Delete error:", err);
    res.status(500).json({ message: "Database delete error" });
  }
});

// ✅ Update entry by ID
app.put("/api/names/:id", async (req, res) => {
  try {
    await Contact.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: "Entry updated successfully" });
  } catch (err) {
    console.error("❌ Update error:", err);
    res.status(500).json({ message: "Database update error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
