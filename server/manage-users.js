#!/usr/bin/env node

/**
 * CLI tool to manage users for the test generator.
 *
 * Usage:
 *   node server/manage-users.js add <email> <name> <password>
 *   node server/manage-users.js remove <email>
 *   node server/manage-users.js list
 *   node server/manage-users.js reset-password <email> <new-password>
 */

const fs = require("node:fs");
const path = require("node:path");
const bcrypt = require("bcryptjs");
const crypto = require("node:crypto");

const USERS_FILE = path.join(__dirname, "users.json");
const BCRYPT_ROUNDS = 12;

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

const [, , command, ...args] = process.argv;

if (command === "add") {
  const [email, name, password] = args;
  if (!email || !name || !password) {
    console.error("Usage: node server/manage-users.js add <email> <name> <password>");
    process.exit(1);
  }

  const data = loadUsers();
  const emailLower = email.toLowerCase().trim();

  if (data.users.some((u) => u.email === emailLower)) {
    console.error(`User with email "${emailLower}" already exists.`);
    process.exit(1);
  }

  const id = crypto.randomUUID();
  const passwordHash = bcrypt.hashSync(password, BCRYPT_ROUNDS);

  data.users.push({
    id,
    email: emailLower,
    name: name.trim(),
    passwordHash,
    createdAt: new Date().toISOString()
  });

  saveUsers(data);
  console.log(`User added: ${emailLower} (${name.trim()})`);

} else if (command === "remove") {
  const [email] = args;
  if (!email) {
    console.error("Usage: node server/manage-users.js remove <email>");
    process.exit(1);
  }

  const data = loadUsers();
  const emailLower = email.toLowerCase().trim();
  const before = data.users.length;
  const user = data.users.find((u) => u.email === emailLower);

  data.users = data.users.filter((u) => u.email !== emailLower);

  if (data.users.length === before) {
    console.error(`User "${emailLower}" not found.`);
    process.exit(1);
  }

  // Also remove their refresh tokens
  if (user) {
    data.refreshTokens = (data.refreshTokens || []).filter((rt) => rt.userId !== user.id);
  }

  saveUsers(data);
  console.log(`User removed: ${emailLower}`);

} else if (command === "list") {
  const data = loadUsers();
  if (data.users.length === 0) {
    console.log("No users found. Add one with: node server/manage-users.js add <email> <name> <password>");
  } else {
    console.log(`\n  Users (${data.users.length}):\n`);
    for (const u of data.users) {
      console.log(`  - ${u.email}  (${u.name})  [id: ${u.id}]  created: ${u.createdAt || "unknown"}`);
    }
    console.log();
  }

} else if (command === "reset-password") {
  const [email, newPassword] = args;
  if (!email || !newPassword) {
    console.error("Usage: node server/manage-users.js reset-password <email> <new-password>");
    process.exit(1);
  }

  const data = loadUsers();
  const emailLower = email.toLowerCase().trim();
  const user = data.users.find((u) => u.email === emailLower);

  if (!user) {
    console.error(`User "${emailLower}" not found.`);
    process.exit(1);
  }

  user.passwordHash = bcrypt.hashSync(newPassword, BCRYPT_ROUNDS);

  // Invalidate all refresh tokens for this user
  data.refreshTokens = (data.refreshTokens || []).filter((rt) => rt.userId !== user.id);

  saveUsers(data);
  console.log(`Password reset for: ${emailLower}`);

} else {
  console.log(`
  User Management CLI

  Commands:
    add <email> <name> <password>        Add a new user
    remove <email>                       Remove a user
    list                                 List all users
    reset-password <email> <password>    Reset a user's password

  Examples:
    node server/manage-users.js add john@company.com "John Doe" mypassword123
    node server/manage-users.js list
    node server/manage-users.js reset-password john@company.com newpassword
    node server/manage-users.js remove john@company.com
  `);
}
