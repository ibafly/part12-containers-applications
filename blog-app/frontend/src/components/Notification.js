import React from "react"
const Notification = ({ message }) => {
  const msgStyle = {
    background: "gray",
    padding: "5px",
    fontSize: "16px",
    fontWeight: "bold",
    color: "green",
    border: "solid 4px",
    borderRadius: "4px",
  }
  return !message ? null : (
    <p
      style={{
        ...msgStyle,
        color: message.includes("wrong") ? "red" : "green",
      }}
      className={"notification"}
    >
      {message}
    </p>
  )
}

export default Notification
