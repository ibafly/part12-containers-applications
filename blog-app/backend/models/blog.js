const config = require("../utils/config")
const logger = require("../utils/logger")
const mongoose = require("mongoose")

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  content: String,
  likes: Number,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  commentIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
})

blogSchema.set("toJSON", {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString()
    delete returnedObj._id
    delete returnedObj.__v
  },
})

module.exports = mongoose.model("Blog", blogSchema)
