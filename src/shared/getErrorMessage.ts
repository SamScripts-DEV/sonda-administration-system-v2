export function getErrorMessage(error: any): string {
    if (error.response?.data?.message) return error.response.data.message;
    if (typeof error.response?.data === "string") return error.response.data;
    return error.message || "Error inesperado";
}