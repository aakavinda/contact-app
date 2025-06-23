// server.js (MongoDB + Mongoose version)
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ✅ MongoDB Atlas connection string (replace with your own)
const MONGODB_URI = "mongodb+srv://akavinda:<db_password>@cluster0.0amp58o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB Atlas"))
.catch((err) => console.error("MongoDB connection error:", err));

// ✅ Define Mongoose schema and model
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

const Contact = mongoose.model("Contact", contactSchema);

// ✅ POST: Add new entry
app.post("/api/contact", async (req, res) => {
  try {
    const contact = new Contact(req.body);
    const saved = await contact.save();
    res.json({ message: `Hi ${saved.name}, your data was saved!`, id: saved._id });
  } catch (err) {
    console.error("Insert error:", err);
    res.status(500).json({ message: "Database error" });
  }
});

// ✅ GET: Fetch all entries
app.get("/api/names", async (req, res) => {
  try {
    const entries = await Contact.find().sort({ created_at: -1 });
    res.json(entries);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ message: "Database error" });
  }
});

// ✅ DELETE: Remove an entry by ID
app.delete("/api/names/:id", async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: "Entry deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Database delete error" });
  }
});

// ✅ PUT: Update an entry by ID
app.put("/api/names/:id", async (req, res) => {
  try {
    await Contact.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: "Entry updated successfully" });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Database update error" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
