import Axios from "axios"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

if (!API_BASE_URL) {
    console.warn("VITE_API_BASE_URL is not defined in environment variables")
}

const axios = Axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    timeout: 0, // no timeout
})

// Request interceptor
axios.interceptors.request.use(
    (config) => {
        console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.params)
        return config
    },
    (error) => {
        console.error("[API Request Error]", error)
        return Promise.reject(error)
    }
)

// Response interceptor
axios.interceptors.response.use(
    (response) => {
        console.log(`[API Response] ${response.config.url}`, response.status)
        return response.data
    },
    (error) => {
        const status = error.response?.status
        const message = error.response?.data?.message || error.message

        console.error(
            `[API Error] ${status || "Network Error"}:`,
            error.response?.data || message
        )

        // Handle specific error codes
        if (status === 401) {
            // Unauthorized
            console.error("Unauthorized")
        } else if (status === 403) {
            // Forbidden
            console.error("Access forbidden")
        } else if (status === 404) {
            // Not found
            console.error("Resource not found")
        } else if (status >= 500) {
            // Server error
            console.error("Server error occurred")
        }

        return Promise.reject(error)
    }
)

export default axios
