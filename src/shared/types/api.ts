export interface ApiResponse<T> {
    result: "success" | "error"
    code: number
    data?: T
    message?: string
}