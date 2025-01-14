const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the class schema
const classSchema = new Schema({
  adminId: { type: String, required: true }, // Admin ID for the class
  className: { type: String, required: true }, // Class name
  classCode: { type: String, required: true, unique: true }, // Unique class code
  subject: { type: String }, // Subject (optional)
  students: { type: [String], default: [] }, // Array of student IDs (unique logic will be handled in application)
  announcementId: { type: String, unique: true }, // Link to the announcement (unique)
  studentsPost: [
    {
      studentId: { type: String, required: true }, // ID of the student making the post
      content: { type: String, required: true }, // Content of the post
      createdAt: { type: Date, default: Date.now }, // Timestamp for the post
    },
  ],
});

// Ensure students' uniqueness is handled manually
classSchema.pre("save", function (next) {
  // Remove duplicates from the students array before saving
  this.students = [...new Set(this.students)];
  next();
});

module.exports = mongoose.model("Class", classSchema);
