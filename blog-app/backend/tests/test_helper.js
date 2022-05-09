const Blog = require("../models/blog")
const User = require("../models/user")

const initialBlogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  },
  {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
  },
  {
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
  },
  {
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
  },
  {
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
  },
]

const aNewBlogWithContentAndNoLikes = {
  title: "Type wars",
  author: "Robert C. Martin",
  url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
  content: "Here is the content of a blog.",
}

const aNewBlogWithoutTitleNorUrl = {
  author: "Robert C. Martin",
  content: "Here is the content of a blog without title nor url.",
}

const nonExistingId = async () => {
  const note = new Note({ content: "willremovethissoon", date: new Date() })
  await note.save()
  await note.remove()

  return note._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON()) // in res.send(blogs), blogs are identified as object and automatically passed to xxx.toJSON()
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

const initialOneRootUser = [
  {
    username: "root",
    name: "Superuser",
    passwordHash:
      "$2b$10$6hbZg2hNCOHdY0IklItNG.spICxlK1IXVN0xJtj52IHJRIw.L/U8q",
  },
]

const rootUserToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvb3QiLCJpZCI6IjYxYzZhZTMwMWJmNmZiYjRlZThjMTM5YyIsImlhdCI6MTY0MDQxMDY3NX0.Nvv-GxYqrRKckXICb7yaApo4qXIKRgwLHKogQ6DUFIU"

module.exports = {
  initialBlogs,
  aNewBlogWithContentAndNoLikes,
  aNewBlogWithoutTitleNorUrl,
  nonExistingId,
  blogsInDb,
  usersInDb,
  initialOneRootUser,
  rootUserToken,
}
