// The router is in fact a middleware, that can be used for defining "related routes" in a single place, that is typically placed in its own module.
const blogsRouter = require("express").Router()
const Blog = require("../models/blog")
const User = require("../models/user")
const Comment = require("../models/comment")
// const jwt = require("jsonwebtoken")

// blogsRouter.get("/", (request, response) => {
//   // notice that /api/blogs becomes /
//   Blog.find({}).then(blogs => {
//     response.json(blogs)
//   })
// })

blogsRouter.get("/", async (req, res) => {
//  const userFromToken = req.user
//  if (!userFromToken) {
//    return res.status(401).json({ error: "token missing or invalid" })
//  }

  const blogs = await Blog.find({}).populate("userId", "username name") // Blog.find({}) returns a Promise while await Blog.find({}) returns the result when find operation fullfilled // "username name" can be written as {username:1, name:1}
  console.log(blogs)
  //console.dir(blogs) // will show partial properties of an object
  //console.log(
  //  Object.getOwnPropertyNames(Blog),
  //  "===",
  //  Object.getOwnPropertyNames(Blog.prototype) // includes $__remove method
  //)
  res.json(blogs)
})

//--- extracted to middleware tokenExtractor
// const getTokenFrom = request => {
//   const authorization = request.get("authorization")
//   if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
//     return authorization.slice(7) // `bear ` sliced out, generate a new string of token
//   }
//   return null
// }

blogsRouter.post("/", async (req, res) => {
  const body = req.body

  if (!body.title && !body.url) {
    return res.status(400).send({ error: "title and url are missing" })
  }

  //  const token = getTokenFrom(req)
  const token = req.token
  // const userFromToken = jwt.verify(token, process.env.SECRET_KEY) // extracted to middleware userExtractor
  const userFromToken = req.user
  if (!token || !userFromToken) {
    return res.status(401).json({ error: "token missing or invalid" })
  }
  // const user = await User.findById(body.userId)
  const user = await User.findById(userFromToken.id)
  // console.log(body.userId, user)
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    content: body.content,
    likes: body.likes || 0,
    userId: user._id,
  })

  const savedBlog = await blog.save()
  user.blogIds = user.blogIds.concat(savedBlog._id)
  await user.save({ validateBeforeSave: false })

  res.status(201).json(savedBlog)
})

blogsRouter.delete("/:id", async (req, res) => {
  const body = req.body
  const params = req.params
  const token = req.token
  const id = params.id

  const blog = await Blog.findById(id)
  if (!blog) {
    res.status(400).end()
  }

  // const userFromToken = jwt.verify(token, process.env.SECRET_KEY) // extracted to middleware userExtractor
  const userFromToken = req.user
  if (!token || !userFromToken) {
    return res.status(401).json({ error: "token missing or invalid" })
  }

  if (!blog.userId.toString() === userFromToken.id.toString()) {
    return res.status(403).json({ error: "wrong user, no right to delete" })
  }

  await Blog.findByIdAndDelete(id)
  res.status(204).end()
})

blogsRouter.put("/:id", async (req, res) => {
  const userFromToken = req.user
  if (!userFromToken) {
    return res.status(401).json({ error: "token missing or invalid" })
  }

  const id = req.params.id
  const result = await Blog.findByIdAndUpdate(id, req.body, { new: true }) // option new for pass updated result instead of the founded one
  if (result) {
    res.status(200).json(result)
  } else {
    res.status(400).end()
  }
})

blogsRouter.get("/:id", async (req, res) => {
  const userFromToken = req.user
  if (!userFromToken) {
    return res.status(401).json({ error: "token missing or invalid" })
  }

  const id = req.params.id
  const blog = await Blog.findById(id).populate("commentIds", "content")

  if (blog) {
    res.status(200).json(blog)
  } else {
    res.status(400).end()
  }
})

blogsRouter.post("/:id/comments", async (req, res) => {
  const id = req.params.id
  const body = req.body

  const userFromToken = req.user
  if (!userFromToken) {
    // !token also results no userFromToken
    return res.status(401).json({ error: "token missing or invalid" })
  }

  if (!body.content) {
    return res.status(400).send({ error: "comment content missing" })
  }

  const blog = await Blog.findById(id)

  if (!blog) {
    return res.status(400).send({ error: "no blog found" })
  }

  const comment = new Comment({ content: body.content })
  const savedComment = await comment.save()
  blog.commentIds = blog.commentIds.concat(savedComment._id)
  await blog.save()

  res.status(201).json(savedComment)
})

// blogsRouter.get("/:id/comments", async (req, res) => {
//   const id = req.params.id
//   const blog = await Blog.findById(id).populate("commentIds", "content")
//   if (blog) {
//     res.status(200).json(blog.commentIds)
//   } else {
//     res.status(400).end()
//   }
// })

module.exports = blogsRouter
