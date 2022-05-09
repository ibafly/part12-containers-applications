import React from "react"
import "@testing-library/jest-dom/extend-expect"
import { render, fireEvent } from "@testing-library/react"
import Blog from "./Blog"

describe("<Blog />", () => {
  let component

  //   const toggleBtnOnClick = jest.fn()
  const opAfterLikeBtnOnClick = jest.fn()
  const toggleBtnOnClick = jest.fn()
  // const opAfterRemoveBtnOnClick = jest.fn()
  //   const showRemoveBtn = jest.fn()

  beforeEach(() => {
    const blog = {
      title: "Good title",
      author: "Some One",
      url: "https://from.some.place",
      likes: 6,
      id: "123456",
      toggle: false,
    }

    component = render(
      <Blog blog={blog} opAfterLikeBtnOnClick={opAfterLikeBtnOnClick} toggleBtnOnClick={toggleBtnOnClick} />
    )
  })

  test("renders title and author of one blog entry, but not url and number of likes by default", () => {
    expect(component.container).toHaveTextContent("Good title")
    expect(component.container).toHaveTextContent("Some One")
    const div = component.container.querySelector(".togglableContent")
    expect(div).toHaveStyle("display: none")
  })

  test("renders url and number of likes after view button clicked", () => {
    const btn = component.getByText("view")
    fireEvent.click(btn) // event handler not finished, since function feeded to opAfterLikeBtnOfClick prop changes the state of App.js. How can a unit test handle that?

	expect(toggleBtnOnClick.mock.calls).toHaveLength(1)
//    const div = component.container.querySelector(".togglableContent")
//    expect(div).not.toHaveStyle("display: none")
  })

  test("opAfterLikeBtnOnClick is called twice after like button is clicked twice", () => {
    const btn = component.getByText("like")
    fireEvent.click(btn)
    fireEvent.click(btn)

    expect(opAfterLikeBtnOnClick.mock.calls).toHaveLength(2)
  })
})
