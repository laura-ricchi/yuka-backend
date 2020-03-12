require("dotenv").config();
const express = require("express");
const formidableMiddleware = require("express-formidable");
const cors = require("cors");
const helmet = require("helmet");
const mongoose = require("mongoose");

const app = express();
app.use(formidableMiddleware());
app.use(cors());
app.use(helmet());

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/yuka", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

const userRoutes = require("./routes/user");
app.use(userRoutes);

app.get("/", function(req, res) {
  res.send("Welcome to the Yuka API.");
});
app.all("*", function(req, res) {
  res.status(404).json({ error: "Page not found" });
});
app.listen(process.env.PORT || 3000, () => {
  console.log("Server has started");
});
