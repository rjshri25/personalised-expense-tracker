const express = require("express")
const bcrypt = require("bcrypt")
const User = require("../models/User")

const router = express.Router() 

router.post("/", async (req, res) => {
  const { fullName, email, password, confirmpassword } = req.body

  if (!fullName || !email || !password || !confirmpassword)
    return res.send({ status: false, message: "All fields required" })

  if (password !== confirmpassword)
    return res.send({ status: false, message: "Passwords do not match" });

  try {
    const existing = await User.findOne({ email });

    if (existing)
      return res.send({ status: false, message: "user exists!!" });

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      fullName,
      email,
      password: hashedPassword
    });

    res.send({ status: true, message: "User registered successfully" });

  } catch {
    res.send({ status: false, message: "Registration failed" });
  }
})

module.exports = router