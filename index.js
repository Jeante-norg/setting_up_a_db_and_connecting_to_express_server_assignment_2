const express = require("express");
const { resolve } = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const mongoose = require("mongoose");
const User = require("./schema.js");

const app = express();
const port = process.env.PORT || 3010;

app.use(express.static("static"));
app.use(express.json());

mongoose
  .connect(process.env.DB_CONN, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((conn) => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log("Error connecting to database", err.message);
  });

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const newUser = new User({ name, email, password });
    await newUser.save();

    res.status(201).json({ message: "User successfully created." });
  } catch (error) {
    if (error === "ValidationError") {
      res
        .status(400)
        .json({ message: "Validation error", details: error.message });
    } else {
      res.status(500).json({ message: "Server error", details: error.message });
    }
  }
};

app.post("/api/users", createUser);
app.get("/", (req, res) => {
  res.sendFile(resolve(__dirname, "pages/index.html"));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
