const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./auth");

function authMiddleware(req, res, next) {
  const authHeader = String(req.headers.authorization || "");
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  if (!token) {
    return res.status(401).json({ error: "Authentication required." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { id: decoded.userId, email: decoded.email, name: decoded.name };
    next();
  } catch (err) {
    if (err && err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired.", code: "TOKEN_EXPIRED" });
    }
    return res.status(401).json({ error: "Invalid token." });
  }
}

module.exports = authMiddleware;
