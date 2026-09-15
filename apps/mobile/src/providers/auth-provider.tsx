import * as SecureStore from "expo-secure-store";
import { AuthContext } from "@/contexts/auth-context";
import { PropsWithChildren, useCallback, useEffect, useState } from "react";

const TOKEN_KEY = "token-storage-key";

export default function AuthProvider({ children }: PropsWithChildren) {
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        async function fetchToken() {
            setToken(await SecureStore.getItemAsync(TOKEN_KEY));
        }

        void fetchToken();
    }, []);

    const updateToken = useCallback(async (token: string) => {
        setToken(token);

        await SecureStore.setItemAsync(TOKEN_KEY, token);
    }, []);

    return <AuthContext.Provider value={{ token, updateToken }}>{children}</AuthContext.Provider>;
}
