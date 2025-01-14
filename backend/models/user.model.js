const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: { type: String, required: true }, // User's full name
    email: { type: String, required: true, unique: true }, // Unique email for each user
    password: { type: String, required: true }, // User's password
    isTeacher: { type: Boolean, default: false }, // Flag to identify if the user is a teacher
    role: { type: String, enum: ["student", "teacher", "admin"], default: "student" }, // User role (expandable)
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("User", userSchema);
