import { type ApiError, hasApiError } from "./error";
import { isAxiosError } from "axios";

export async function requestApi<T>(request: () => Promise<{ data: T | ApiError }>): Promise<T> {
    try {
        const { data } = await request();

        if (hasApiError(data)) throw new Error(data.message.join(", "));

        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response?.data) {
            const serverData = error.response.data as { message?: string | string[] };
            const message = Array.isArray(serverData.message) ? serverData.message.join(" ,") : serverData.message;
            throw message || "Network request failed. Try again.";
        }

        throw error;
    }
}
