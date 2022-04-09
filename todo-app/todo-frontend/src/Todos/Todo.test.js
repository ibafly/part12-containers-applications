import React from "react"
import "@testing-library/jest-dom/extend-expect"
import { render, fireEvent } from "@testing-library/react"
import Todo from "./Todo"

describe("<Todo />", () => {
  let component
  const onClickDelete = jest.fn()
  const onClickComplete = jest.fn()
  const anUndoneTodo = { _id: "1", text: "Todo 1", done: false }

  beforeEach(() => {
    component = render(
      <Todo
        todo={anUndoneTodo}
        onClickDelete={onClickDelete}
        onClickComplete={onClickComplete}
      />
    )
  })

  test('render 1 todo entries with text "Todo 1"', () => {
    expect(component.container).toHaveTextContent("Todo 1")
    expect(component.container).toHaveTextContent("This todo is not done")
  })

  test('1 undone todo entry has btn "Set as done", click it will fire onClickComplete', () => {
    const btn = component.getByText("Set as done")
    fireEvent.click(btn)

    expect(onClickComplete.mock.calls).toHaveLength(1)
    expect(onClickComplete.mock.calls[0][0]._id).toBe("1")
    expect(onClickComplete.mock.calls[0][0].text).toBe("Todo 1")
    expect(onClickComplete.mock.calls[0][0].done).toBe(false)
  })
})
