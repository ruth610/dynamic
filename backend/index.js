const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config(); // For environment variables

const app = express();
const PORT = process.env.PORT || 8000; // Use environment variable for port

const userRouter = require("./routes/users");
const classRouter = require("./routes/class");

app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

// Use environment variable for MongoDB URI
const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ar-class";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connection Established Successfully!"))
  .catch((err) => console.error("MongoDB Connection Error: ", err));

app.use("/api/user", userRouter);
app.use("/api/class", classRouter);

app.listen(PORT, () => console.log(`Backend Up and running at Port: ${PORT}`));

// Graceful shutdown
process.on("SIGINT", () => {
  mongoose.connection.close(() => {
    console.log("MongoDB connection closed due to app termination");
    process.exit(0);
  });
});
