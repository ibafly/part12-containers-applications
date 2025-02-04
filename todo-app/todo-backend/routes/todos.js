const express = require("express")
const redis = require("../redis")
const { Todo } = require("../mongo")
const router = express.Router()

//Todo.countDocuments({}).then(async res=>{
//	await redis.setAsync('todoCounter', res)
//})

/* GET todos listing. */
router.get("/", async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos)
})

/* POST todo to listing. */
router.post("/", async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false,
  })
  res.send(todo)

  const counter = await redis.getAsync("todoCounter")
  await redis.setAsync("todoCounter", counter ? Number(counter) + 1 : 1)
})

const singleRouter = express.Router()

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete("/", async (req, res) => {
  await req.todo.delete()
  res.sendStatus(200)
})

/* GET todo. */
singleRouter.get("/", async (req, res) => {
  res.send(req.todo) // Implement this
})

/* PUT todo. */
singleRouter.put("/", async (req, res) => {
  const updatedTodo = await req.todo.updateOne(
    {
      text: req.body.text,
      done: req.body.done,
    },
    { new: true }
  )
  res.send(updatedTodo) // Implement this
})

router.use("/:id", findByIdMiddleware, singleRouter)

module.exports = router
