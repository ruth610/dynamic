const Class = require("../models/class.model");

module.exports = async (req, res, next) => {
  try {
    const userId = req.userData.userId;
    const classCode = req.params.classCode;

    const theClass = await Class.findOne({ classCode });

    if (!theClass) {
      return res.status(404).json({ message: "Invalid Class!" });
    }

    if (theClass.adminId.toString() === userId.toString()) {
      return next();
    }

    return res.status(403).json({ message: "Not an Admin!" });
  } catch (err) {
    console.error("Error in admin check middleware:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
