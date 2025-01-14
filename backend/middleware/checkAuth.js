const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // Extract token from Authorization header
  const token = req.headers["auth-token"];

  // If no token is provided, respond with a 401 Unauthorized error
  if (!token) {
    return res.status(401).json({ message: "Access Denied! No token provided." });
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, "secretkey");

    // Attach the decoded user data to the request object
    req.userData = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Handle invalid token error
    console.error("Token verification failed:", error);
    return res.status(400).json({ message: "Invalid Token!" });
  }
};
