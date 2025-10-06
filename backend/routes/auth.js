const express = require("express");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const Student = require("../models/Student.js");
const { signJwt } = require("../utils/jwt.js");

const router = express.Router();

router.post(
  "/register",
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    const { email, password, fullName, studentId } = req.body;
    const existing = await Student.findOne({ email });
    if (existing)
      return res.status(409).json({ message: "Email already registered" });
    const passwordHash = await bcrypt.hash(password, 10);
    const student = await Student.create({
      email,
      passwordHash,
      fullName,
      studentId,
    });
    return res.status(201).json({ id: student._id, email: student.email });
  }
);

router.post(
  "/login",
  body("email").isEmail(),
  body("password").isString(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    const { email, password } = req.body;
    const student = await Student.findOne({ email });
    if (!student)
      return res.status(401).json({ message: "Invalid credentials" });
    const ok = await bcrypt.compare(password, student.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });
    const token = signJwt({ sub: student._id.toString(), role: "student" });
    return res.json({ token });
  }
);

module.exports = router;
