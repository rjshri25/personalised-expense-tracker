const express = require("express")
const bcrypt = require("bcrypt")
const User = require("../models/User")

const router = express.Router()

router.post("/", async (req, res) => {
  const { email, password } = req.body

  if (!email || !password)
    return res.send({ status: false, message: "Email and password required" })

  try {
    const user = await User.findOne({ email })
    if (!user)
      return res.send({ status: false, message: "User not found" })

    const match = await bcrypt.compare(password, user.password)
    if (!match)
      return res.send({ status: false, message: "Incorrect password" })

    res.send({ status: true, message: "Login successful", user: { fullName: user.fullName, email: user.email } });
  } catch (err) {
    console.error(err);
    res.send({ status: false, message: "Login failed" })
  }
})

module.exports = router