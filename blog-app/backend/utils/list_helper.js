const _ = require("lodash")

const dummy = blogs => {
  return 1
}

const totalLikes = blogs => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }

  return blogs.reduce(reducer, 0)
}

const favoriteBlog = blogs => {
  const reducer = (bigger, item) => {
    return bigger.likes > item.likes ? bigger : item
  }
  const biggest = blogs.reduce(reducer, blogs[0])
  return { title: biggest.title, author: biggest.author, likes: biggest.likes }
}

const mostBlogs = blogs => {
  const authors = blogs.map(ele => ele.author)
  const counts = _.countBy(authors) // obj
  const countArr = _.map(counts, (val, key) => {
    return { author: key, blogs: val }
  })

  const reducer = (bigger, item) => {
    return bigger.blogs > item.blogs ? bigger : item
  }
  const biggest = countArr.reduce(reducer, countArr[0])
  return biggest
}

const mostLikes = blogs => {
  const counts = _.reduce(
    blogs,
    (result, ele, idx) => {
      result[ele.author] = result[ele.author] + ele.likes || ele.likes
      return result
    },
    {}
  )
  const countArr = _.map(counts, (val, key) => {
    return { author: key, likes: val }
  })

  const reducer = (bigger, item) => {
    return bigger.likes > item.likes ? bigger : item
  }
  const biggest = countArr.reduce(reducer, countArr[0])
  return biggest
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }
