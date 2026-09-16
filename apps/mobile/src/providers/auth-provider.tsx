import { AuthContext } from "@/contexts/auth-context";
import { useGetDevice } from "@/hooks/tan-stack/use-device";
import { injectTokenResolver, injectTokenUpdater } from "@/lib/api/axios";
import * as SecureStore from "expo-secure-store";
import { PropsWithChildren, useCallback, useEffect, useState } from "react";

const TOKEN_KEY = "TOKEN_KEY";

export default function AuthProvider({ children }: PropsWithChildren) {
    const [token, setToken] = useState<string | null>(null);

    const { data: device } = useGetDevice({ enabled: !!token });

    const authenticated = Boolean(device);

    const updateToken = useCallback(async (token: string) => {
        setToken(token);
        await SecureStore.setItemAsync(TOKEN_KEY, token);
    }, []);

    useEffect(() => {
        injectTokenUpdater(updateToken);
        injectTokenResolver(() => token);
    }, [token, updateToken]);

    useEffect(() => {
        async function fetchToken() {
            setToken(await SecureStore.getItemAsync(TOKEN_KEY));
        }
        void fetchToken();
    }, []);

    return <AuthContext.Provider value={{ token, authenticated, updateToken }}>{children}</AuthContext.Provider>;
}
