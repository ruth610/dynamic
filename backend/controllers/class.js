const Class = require("../models/class.model");
const Announcement = require("../models/announcement.model");

const classCodeGenerator = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length: 7 }, () =>
    characters.charAt(Math.floor(Math.random() * characters.length))
  ).join("");
};

exports.classes = async (req, res) => {
  try {
    const classes = await Class.find({ students: req.userData.userId });
    if (!classes.length) {
      return res.status(200).json({ message: "Not in any class" });
    }
    res.status(200).json({ classes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while fetching classes" });
  }
};

exports.createClass = async (req, res) => {
  try {
    const classCode = classCodeGenerator();
    const newAnnouncement = new Announcement({ classCode });
    await newAnnouncement.save();

    const newClass = new Class({
      adminId: req.userData.userId,
      className: req.body.className,
      subject: req.body.subject,
      classCode,
      announcementId: newAnnouncement._id,
    });

    await newClass.save();
    res.status(201).json({
      message: "Class created successfully",
      classCode,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while creating the class" });
  }
};

exports.singleClass = async (req, res) => {
  try {
    const room = await Class.findOne({ classCode: req.params.classCode });
    if (!room) {
      return res.status(404).json({ error: "Class not found" });
    }
    res.status(200).json({ message: "Class found", details: room });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while fetching the class" });
  }
};

exports.joinClass = async (req, res) => {
  try {
    const { classCode } = req.body;
    const userId = req.userData.userId;

    const theClass = await Class.findOne({ classCode });
    if (!theClass) {
      return res.status(404).json({ error: "Invalid class code" });
    }

    if (theClass.students.includes(userId)) {
      return res.status(400).json({ error: "User already in the class" });
    }

    theClass.students.push(userId);
    await theClass.save();

    res.status(200).json({ message: "Added to class" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while joining the class" });
  }
};

exports.displayStudents = async (req, res) => {
  try {
    const { classCode } = req.params;
    const classDetail = await Class.findOne({ classCode });

    if (!classDetail) {
      return res.status(404).json({ error: "Invalid class code" });
    }

    res.status(200).json({
      message: `Displaying details of students in class: ${classCode}`,
      students: classDetail.students,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while fetching students" });
  }
};

exports.announcement = async (req, res) => {
  try {
    const { classCode } = req.params;
    const announcement = {
      title: req.body.title,
      content: req.body.content,
      assignment: req.body.assignment,
      due: req.body.due,
    };

    const theAnnouncement = await Announcement.findOneAndUpdate(
      { classCode },
      { $push: { announcements: announcement } },
      { new: true }
    );

    if (!theAnnouncement) {
      return res.status(404).json({ error: "Invalid class code" });
    }

    res.status(200).json({ message: "Announcement made!", announcement });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while making the announcement" });
  }
};

exports.posts = async (req, res) => {
  try {
    const { classCode } = req.params;

    const theClass = await Class.findOne({ classCode });
    if (!theClass) {
      return res.status(404).json({ error: "Invalid class code" });
    }

    const announcements = await Announcement.findOne({ _id: theClass.announcementId });
    if (!announcements) {
      return res.status(404).json({ error: "No announcements yet" });
    }

    res.status(200).json({ announcements });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while fetching announcements" });
  }
};
