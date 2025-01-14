const express = require("express");
const router = express.Router();

const {
  classes,
  createClass,
  singleClass,
  joinClass,
  displayStudents,
  announcement,
  posts,
} = require("../controllers/class");

const checkAuth = require("../middleware/checkAuth");
const checkAdmin = require("../middleware/checkAdmin");

// Apply authentication middleware to all routes
router.use(checkAuth);

// Class routes
router.get("/", classes); // Get all classes
router.post("/create", createClass); // Create a new class
router.post("/join", joinClass); // Join a class

// Specific class routes
router.get("/:classCode", singleClass); // Get a single class by classCode
router.post("/:classCode/announcement", announcement); // Post an announcement
router.get("/:classCode/students", displayStudents); // Get students of a class
router.get("/:classCode/posts", posts); // Get posts of a class

module.exports = router;
