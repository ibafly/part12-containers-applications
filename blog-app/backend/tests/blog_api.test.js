const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const api = supertest(app)
const helper = require("./test_helper")

const Blog = require("../models/blog")
const User = require("../models/user")

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
  await User.deleteMany({})
  await User.insertMany(helper.initialOneRootUser)
}, 100000)

describe("initial blogs", () => {
  test("are returned as JSON && there are 6 blogs initially && id property is named 'id'", async () => {
    const res = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/)

    expect(res.body).toHaveLength(6)

    for (blogObj of res.body) {
      expect(blogObj.id).toBeDefined()
    }
  }, 100000) // Jest default test timeout is 5000ms
})

describe("addition of a new blog", () => {
  test("succeeds with right user token (logged in user)", async () => {
    const rootUser = { username: "root", password: "himitsu" }
    const result = await api.post("/api/login").send(rootUser).expect(200)
    const token = result.body.token
    const authorization = `bearer ` + token
    // bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvb3QiLCJpZCI6IjYxYzZhZTMwMWJmNmZiYjRlZThjMTM5YyIsImlhdCI6MTY0MDQxMDY3NX0.Nvv-GxYqrRKckXICb7yaApo4qXIKRgwLHKogQ6DUFIU

    const res = await api
      .post("/api/blogs")
      .set("Authorization", authorization)
      .send(helper.aNewBlogWithContentAndNoLikes)
      .expect(201)
      .expect("Content-Type", /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    //   console.log(res.body)
    expect(res.body.content).toBe(helper.aNewBlogWithContentAndNoLikes.content)
    expect(res.body.likes).toBe(0)
  })

  test("fails with no title nor url (under logged in state)", async () => {
    const res = await api
      .post("/api/blogs")
      .set("Authorization", `bearer ${helper.rootUserToken}`)
      .send(helper.aNewBlogWithoutTitleNorUrl)
      .expect(400)
  })

  test("fails without token", async () => {
    await api
      .post("/api/blogs")
      .send(helper.aNewBlogWithContentAndNoLikes)
      .expect(401)
  })

  // --- history tests before adding token authentication and authorization
  // test("succeeds with valid data && the likes defaults to 0", async () => {
  //   const res = await api
  //     .post("/api/blogs")
  //     .send(helper.aNewBlogWithContentAndNoLikes)
  //     .expect(201)
  //     .expect("Content-Type", /application\/json/)

  //   const blogsAtEnd = await helper.blogsInDb()
  //   expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

  //   //   console.log(res.body)
  //   expect(res.body.content).toBe(helper.aNewBlogWithContentAndNoLikes.content)
  //   expect(res.body.likes).toBe(0)
  // })
  // test("fails with no title nor url", async () => {
  //   const res = await api
  //     .post("/api/blogs")
  //     .send(helper.aNewBlogWithoutTitleNorUrl)
  //     .expect(400)
  // })
})

describe("deletion of a blog", () => {
  //  test("succeeds with an existed id", async () => {
  //    const blogs = await helper.blogsInDb()
  //    const randIdx = Math.floor(Math.random() * blogs.length)
  //    const id = blogs[randIdx].id
  //    const res = await api.delete(`/api/blogs/${id}`).expect(204)
  //  })
  test("fails with an invalid blog id", async () => {
    const res = await api.delete("/api/blogs/INVALID_ID").expect(400)
  })
})

describe("update the info of a blog", () => {
  test("succeeds to plus one to the number of likes", async () => {
    const blogs = await helper.blogsInDb()
    //    const blogs = await Blog.find({})
    const randIdx = Math.floor(Math.random() * blogs.length)
    const id = blogs[randIdx].id
    const likes = blogs[randIdx].likes
    //    console.log(id, likes)
    const res = await api
      .put(`/api/blogs/${id}`)
      .send({ likes: likes + 1 })
      .expect(200)
    //    const blogAtEnd = await Blog.findById(id)
    expect(res.body.likes).toBe(likes + 1)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
