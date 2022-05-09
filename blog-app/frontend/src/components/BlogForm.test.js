import React from "react"
import "@testing-library/jest-dom/extend-expect"
import { render, fireEvent } from "@testing-library/react"
import BlogForm from "./BlogForm"

describe("<BlogForm />", () => {
  let component
  const opAfterSubmit = jest.fn()

  beforeEach(() => {
    component = render(<BlogForm opAfterSubmit={opAfterSubmit} />)
  })

  test("opAfterSubmit gets the right blog details when a new bolg is created (blog form filled, `create` button clicked)", () => {
    const form = component.container.querySelector("form")
    const titleInputField = component.container.querySelector("#title")
    const authorInputField = component.container.querySelector("#author")
    const urlInputField = component.container.querySelector("#url")

    fireEvent.change(titleInputField, { target: { value: "Nice title" } })
    fireEvent.change(authorInputField, { target: { value: "Some Body" } })
    fireEvent.change(urlInputField, {
      target: { value: "https://from.some.where" },
    })
    fireEvent.submit(form)

    expect(opAfterSubmit.mock.calls).toHaveLength(1)
    expect(opAfterSubmit.mock.calls[0][0].title).toBe("Nice title")
    expect(opAfterSubmit.mock.calls[0][0].author).toBe("Some Body")
    expect(opAfterSubmit.mock.calls[0][0].url).toBe("https://from.some.where")
  })
})
