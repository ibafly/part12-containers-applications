const mongoose = require("mongoose")
const uniqueValidator = require("mongoose-unique-validator")

const userSchema = new mongoose.Schema({
  username: { type: String, minLength: 3, required: true, unique: true },
  name: String,
  passwordHash: String,
  blogIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    },
  ],
})

userSchema.plugin(uniqueValidator)

userSchema.set("toJSON", {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString()
    delete returnedObj._id
    delete returnedObj.__v
    delete returnedObj.passwordHash // no reveal of password related in response body
  },
})

module.exports = mongoose.model("User", userSchema)
