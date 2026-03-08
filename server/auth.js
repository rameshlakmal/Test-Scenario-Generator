const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("node:fs");
const path = require("node:path");

const router = express.Router();

const USERS_FILE = path.join(__dirname, "users.json");
const JWT_SECRET = process.env.JWT_SECRET || "change-me-jwt-secret-key";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "change-me-jwt-refresh-secret-key";
const ACCESS_TOKEN_EXPIRY = "1h";
const REFRESH_TOKEN_EXPIRY = "7d";

// Simple in-memory login attempt tracker for rate limiting
const loginAttempts = new Map();
const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_WINDOW_MS = 60 * 1000; // 1 minute

function loadUsers() {
  try {
    const raw = fs.readFileSync(USERS_FILE, "utf8");
    return JSON.parse(raw);
  } catch {
    return { users: [], refreshTokens: [] };
  }
}

function saveUsers(data) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(data, null, 2), "utf8");
}

function checkLoginRateLimit(email) {
  const now = Date.now();
  const key = email.toLowerCase();
  const record = loginAttempts.get(key);
  if (!record) return true;
  // Clean old attempts
  record.attempts = record.attempts.filter((t) => now - t < LOGIN_WINDOW_MS);
  if (record.attempts.length >= MAX_LOGIN_ATTEMPTS) return false;
  return true;
}

function recordLoginAttempt(email) {
  const key = email.toLowerCase();
  const record = loginAttempts.get(key) || { attempts: [] };
  record.attempts.push(Date.now());
  loginAttempts.set(key, record);
}

function clearLoginAttempts(email) {
  loginAttempts.delete(email.toLowerCase());
}

// POST /api/auth/login
router.post("/login", (req, res) => {
  const email = String(req.body && req.body.email ? req.body.email : "").trim().toLowerCase();
  const password = String(req.body && req.body.password ? req.body.password : "");

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  if (!checkLoginRateLimit(email)) {
    return res.status(429).json({ error: "Too many login attempts. Try again in a minute." });
  }

  const data = loadUsers();
  const user = data.users.find((u) => u.email === email);

  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    recordLoginAttempt(email);
    return res.status(401).json({ error: "Invalid email or password." });
  }

  clearLoginAttempts(email);

  const accessToken = jwt.sign(
    { userId: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );

  const refreshToken = jwt.sign(
    { userId: user.id, email: user.email, type: "refresh" },
    JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );

  // Store refresh token
  if (!Array.isArray(data.refreshTokens)) data.refreshTokens = [];
  data.refreshTokens.push({
    token: refreshToken,
    userId: user.id,
    createdAt: new Date().toISOString()
  });
  saveUsers(data);

  res.json({
    accessToken,
    refreshToken,
    user: { id: user.id, email: user.email, name: user.name }
  });
});

// POST /api/auth/refresh
router.post("/refresh", (req, res) => {
  const refreshToken = String(req.body && req.body.refreshToken ? req.body.refreshToken : "");

  if (!refreshToken) {
    return res.status(400).json({ error: "Refresh token is required." });
  }

  const data = loadUsers();
  const stored = (data.refreshTokens || []).find((rt) => rt.token === refreshToken);
  if (!stored) {
    return res.status(401).json({ error: "Invalid refresh token." });
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const user = data.users.find((u) => u.id === decoded.userId);
    if (!user) {
      return res.status(401).json({ error: "User not found." });
    }

    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    res.json({ accessToken });
  } catch {
    // Remove invalid/expired refresh token
    data.refreshTokens = (data.refreshTokens || []).filter((rt) => rt.token !== refreshToken);
    saveUsers(data);
    return res.status(401).json({ error: "Refresh token expired. Please log in again." });
  }
});

// POST /api/auth/logout
router.post("/logout", (req, res) => {
  const refreshToken = String(req.body && req.body.refreshToken ? req.body.refreshToken : "");

  if (refreshToken) {
    const data = loadUsers();
    data.refreshTokens = (data.refreshTokens || []).filter((rt) => rt.token !== refreshToken);
    saveUsers(data);
  }

  res.json({ ok: true });
});

// GET /api/auth/me
router.get("/me", (req, res) => {
  // This route is protected by authMiddleware
  const authHeader = String(req.headers.authorization || "");
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  if (!token) {
    return res.status(401).json({ error: "Not authenticated." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ user: { id: decoded.userId, email: decoded.email, name: decoded.name } });
  } catch {
    return res.status(401).json({ error: "Token expired or invalid." });
  }
});

module.exports = router;
module.exports.JWT_SECRET = JWT_SECRET;
