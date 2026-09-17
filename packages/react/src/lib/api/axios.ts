import { create } from "axios";

export const SERVER_URL = "http://192.168.8.101:3000";

export const api = create({ withCredentials: true, baseURL: SERVER_URL });

type TokenInjector = () => string | null;
let tokenResolver: TokenInjector | null = null;
export function injectTokenResolver(fn: TokenInjector) {
    tokenResolver = fn;
}

type TokenUpdater = (token: string) => Promise<void> | void;
let updateTokenCallback: TokenUpdater | null = null;
export function injectTokenUpdater(fn: TokenUpdater) {
    updateTokenCallback = fn;
}

api.interceptors.request.use((request) => {
    if (tokenResolver) {
        const token = tokenResolver();

        if (token) {
            request.headers.set("Authorization", `Bearer ${token}`);
        }
    }

    return request;
});

api.interceptors.response.use((response) => {
    const newToken = response.headers["x-new-token"] as string | undefined;

    if (newToken && updateTokenCallback) {
        void updateTokenCallback(newToken);
    }

    return response;
});
