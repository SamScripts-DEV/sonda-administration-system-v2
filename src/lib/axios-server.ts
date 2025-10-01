import axios from "axios"

export const serverAxios = axios.create({
    baseURL: process.env.API_BASE_URL,
    timeout: 10000,
    withCredentials: true,
})