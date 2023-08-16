const jwt = require("jsonwebtoken");
const secretKey = "abdurakhmonovsharif4413";
function authenticateUser(req, res, next) {
  // Get the token from the request header
  const token = req.header("Authorization");
  // Check if the token exists
  if (!token) {
    return res.status(401).json({ message: "Access denied" });
  }
  try {
    // Verify the tokens
    const decoded = jwt.verify(token, secretKey);
    // Check the role of the user
    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTimestamp) {
      return res.status(401).json({ message: "Token has expired" });
    }
    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = authenticateUser;
