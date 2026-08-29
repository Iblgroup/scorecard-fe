import Axios from "axios"
import { getToken, redirectToPortal } from "@/utils/session"

const API_ORIGIN = String(import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/+$/, "")
const API_BASE_URL = API_ORIGIN ? `${API_ORIGIN}/api` : ""

if (!API_ORIGIN) {
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

axios.interceptors.request.use(
    (config) => {
        const token = getToken()
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.params)
        return config
    },
    (error) => {
        console.error("[API Request Error]", error)
        return Promise.reject(error)
    }
)

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

        if (status === 401) {
            redirectToPortal()
        } else if (status === 403) {
            console.error("Access forbidden")
        } else if (status === 404) {
            console.error("Resource not found")
        } else if (status >= 500) {
            console.error("Server error occurred")
        }

        return Promise.reject(error)
    }
)

export default axios
