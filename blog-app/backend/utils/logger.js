const info = (...params) => {
  if (process.env.NODE_ENV !== "test") {
    // The middleware that outputs information about the HTTP requests is obstructing the test execution output. Let us modify the logger so that it does not print to console in test mode
    console.log(...params)
  }
}

const error = (...params) => {
  if (process.env.NODE_ENV !== "test") {
    console.error(...params)
  }
}

module.exports = {
  info,
  error,
}
