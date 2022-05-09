const usersRouter = require("express").Router()
const Users = require("../models/user")
const bcrypt = require("bcrypt")

usersRouter.get("/", async (req, res) => {
  const users = await Users.find({}).populate("blogIds", {
    title: 1,
    url: 1,
    author: 1,
  })
  res.status(200).send(users)
})

usersRouter.post("/", async (req, res) => {
  const body = req.body

  const passwordIsValid = body.password && body.password.length >= 3
  if (!passwordIsValid) {
    return res
      .status(400)
      .send({ error: "password is missing or less than 3 characters" })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const newUser = new Users({
    username: body.username,
    name: body.name,
    passwordHash,
  })

  await newUser.save()
  res.status(201).send(newUser)
})

module.exports = usersRouter
