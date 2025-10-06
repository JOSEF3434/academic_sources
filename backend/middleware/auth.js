const { verifyJwt } = require("../utils/jwt.js");
const Student = require("../models/Student.js");

async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Missing token" });
  try {
    const decoded = verifyJwt(token);
    const student = await Student.findById(decoded.sub).lean();
    if (!student) return res.status(401).json({ message: "Invalid token" });
    req.user = {
      id: student._id.toString(),
      email: student.email,
      role: "student",
    };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
module.exports = { requireAuth };
