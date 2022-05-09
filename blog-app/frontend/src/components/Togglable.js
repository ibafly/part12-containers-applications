import React, { useState, useImperativeHandle } from "react"
import PropTypes from "prop-types"

const Togglable = React.forwardRef(({ children, btnLabel }, ref) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? "none" : "" }
  const showWhenVisible = { display: visible ? "" : "none" }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => {
    return { toggleVisibility } // return an object not a function variable
  })

  return (
    <div>
      <button onClick={toggleVisibility} style={hideWhenVisible}>
        {btnLabel}
      </button>
      <div style={showWhenVisible}>{children}</div>
    </div>
  )
})

Togglable.propTypes = {
  btnLabel: PropTypes.string.isRequired,
}

Togglable.displayName = "Togglable"

export default Togglable
