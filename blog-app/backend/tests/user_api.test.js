const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const api = supertest(app)
const helper = require("./test_helper")

const User = require("../models/user")

beforeEach(async () => {
  await User.deleteMany({})

  await User.insertMany(helper.initialOneRootUser)
}, 100000)

describe("when there is initially one user in db", () => {
  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb()

    const newUserInfo = {
      username: "cat",
      name: "Cat",
      password: "meowmeow",
    }

    const res = await api.post("/api/users").send(newUserInfo).expect(201)

    const usersAtEnd = await helper.usersInDb()
    const usernames = usersAtEnd.map(user => user.username)

    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
    expect(usernames).toContain(newUserInfo.username)
  }, 100000)

  test("creation fails without username/password", async () => {
    const newUser1 = {
      username: "",
      name: "Neko",
      password: "nyanya",
    }
    const newUser2 = {
      username: "neko",
      name: "Neko",
      password: "",
    }

    const res1 = await api.post("/api/users").send(newUser1).expect(400)
    expect(res1.body.error).toContain("`username` is required")

    const res2 = await api.post("/api/users").send(newUser2).expect(400)
    expect(res2.body.error).toContain(
      "password is missing or less than 3 characters"
    )
  })

  test("creation fails with username/password character less than 3", async () => {
    const newUser1 = {
      username: "ne",
      name: "Neko",
      password: "nyanya",
    }
    const newUser2 = {
      username: "neko",
      name: "Neko",
      password: "ny",
    }

    const res1 = await api.post("/api/users").send(newUser1).expect(400)
    expect(res1.body.error).toContain(
      "shorter than the minimum allowed length (3)"
    )

    const res2 = await api.post("/api/users").send(newUser2).expect(400)
    expect(res2.body.error).toContain(
      "password is missing or less than 3 characters"
    )
  })

  test("creation fails with username identical to db, same as the initial one", async () => {
    const newUser = {
      username: helper.initialOneRootUser[0].username,
      name: "Neko",
      password: "nyanya",
    }
    const res = await api.post("/api/users").send(newUser).expect(400)
    expect(res.body.error).toContain("`username` to be unique")
  })
})

afterAll(() => {
  mongoose.connection.close()
})
