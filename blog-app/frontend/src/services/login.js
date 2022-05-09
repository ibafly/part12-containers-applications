import axios from "axios"
const baseUrl = "/api/login"

const login = async credential => {
  const res = await axios.post(baseUrl, credential)
  return res.data
}

export default { login }
