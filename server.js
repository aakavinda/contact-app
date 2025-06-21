// === ✅ server.js ===
const express = require("express");
const cors = require("cors");
const path = require("path");
const mysql = require("mysql2");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "myapp"
});

db.connect((err) => {
  if (err) {
    console.error("MySQL connection failed", err);
    return;
  }
  console.log("Connected to MySQL");
});

app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body;
  const query = "INSERT INTO names (name, email, message) VALUES (?, ?, ?)";
  db.query(query, [name, email, message], (err, result) => {
    if (err) {
      console.error("Insert error:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json({ message: `Hi ${name}, your name was saved in MySQL!`, id: result.insertId });
  });
});

app.get("/api/names", (req, res) => {
  db.query("SELECT * FROM names ORDER BY created_at DESC", (err, results) => {
    if (err) {
      console.error("Fetch error:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json(results);
  });
});

app.delete("/api/names/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM names WHERE id = ?", [id], (err) => {
    if (err) {
      console.error("Delete error:", err);
      return res.status(500).json({ message: "Database delete error" });
    }
    res.json({ message: "Entry deleted successfully" });
  });
});

app.put("/api/names/:id", (req, res) => {
  const id = req.params.id;
  const { name, email, message } = req.body;
  const query = "UPDATE names SET name = ?, email = ?, message = ? WHERE id = ?";
  db.query(query, [name, email, message, id], (err) => {
    if (err) {
      console.error("Update error:", err);
      return res.status(500).json({ message: "Database update error" });
    }
    res.json({ message: "Entry updated successfully" });
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
