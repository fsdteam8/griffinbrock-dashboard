import axios from "axios"
import { getSession } from "next-auth/react"

const API_BASE = process.env.NEXT_PUBLIC_BASE_URL

export const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
})

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    const session = await getSession()
    if (session?.user?.accessToken) {
      config.headers.Authorization = `Bearer ${session.user.accessToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      window.location.href = "/auth/login"
    }
    return Promise.reject(error)
  },
)

export default apiClient
