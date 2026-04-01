import ky from "ky"

export const client = ky.create({
  prefixUrl: import.meta.env.VITE_API_URL,
  timeout: 5000,
  headers: {
    "X-CLIENT": "f9zmaol1"
  }
})