const loginRouter = require("express").Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const User = require("../models/user")

loginRouter.post("/", async (req, res) => {
  const body = req.body

  const user = await User.findOne({ username: body.username })
  const bothRight = user
    ? await bcrypt.compare(body.password, user.passwordHash)
    : false

  if (!bothRight) {
    return res.status(401).json({ error: "invalid username or password" })
  }

  const userForToken = { username: user.username, id: user._id }
  const token = await jwt.sign(userForToken, process.env.SECRET_KEY)
  res
    .status(200)
    .send({ token, userId: user._id, username: user.username, name: user.name })
})

module.exports = loginRouter
