import React, { useState } from "react"

const BlogForm = ({ opAfterSubmit, cancelBtnOnClick }) => {
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [url, setUrl] = useState("")

  const followTitleInput = ({ target }) => {
    setTitle(target.value)
  }
  const followAuthorInput = ({ target }) => {
    setAuthor(target.value)
  }
  const followUrlInput = ({ target }) => {
    setUrl(target.value)
  }
  const formOnSubmit = event => {
    event.preventDefault()
    opAfterSubmit({ title, author, url }) // async create blog
    setTitle("")
    setAuthor("")
    setUrl("")
  }

  return (
    <form onSubmit={formOnSubmit}>
      <div>
        <label htmlFor="title">title:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={followTitleInput}
        />
      </div>
      <div>
        <label htmlFor="author">author:</label>
        <input
          type="text"
          id="author"
          value={author}
          onChange={followAuthorInput}
        />
      </div>
      <div>
        <label htmlFor="url">url:</label>
        <input type="text" id="url" value={url} onChange={followUrlInput} />
      </div>
      <button type="submit">create</button>
      <button onClick={cancelBtnOnClick}>cancel</button>
    </form>
  )
}

export default BlogForm
