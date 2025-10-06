const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET_KEY || "dev_secret_key";
const DEFAULT_EXPIRY = "7d";

function signJwt(payload, options = {}) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: DEFAULT_EXPIRY,
    ...options,
  });
}

function verifyJwt(token) {
  return jwt.verify(token, JWT_SECRET);
}
module.exports = { signJwt, verifyJwt };
