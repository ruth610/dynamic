const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the announcement structure
const announcementSchema = new Schema({
  classCode: { type: String, required: true }, // Class code should be required
  announcements: [
    {
      title: { type: String, required: true }, // Title of the announcement
      content: { type: String, required: true }, // Content of the announcement
      assignment: { type: String }, // Assignment details (optional)
      due: { type: Date }, // Due date for assignments (optional)
      createdAt: { type: Date, default: Date.now }, // Timestamp when the announcement is created
    },
  ],
});

module.exports = mongoose.model("Announcement", announcementSchema);
