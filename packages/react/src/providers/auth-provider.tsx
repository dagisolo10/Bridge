import { AuthContext } from "../contexts/auth-context";
import { useGetDevice } from "../hooks/tan-stack/use-device";
import { injectTokenResolver, injectTokenUpdater } from "../lib/api/axios";

import { type PropsWithChildren, useCallback, useEffect, useState } from "react";

export interface StorageAdapter {
    removeItem: () => Promise<void> | void;
    setItem: (value: string) => Promise<void> | void;
    getItem: () => Promise<string | null> | string | null;
}

interface AuthProviderProps extends PropsWithChildren {
    storage: StorageAdapter;
}

export function AuthProvider({ children, storage }: AuthProviderProps) {
    const [token, setToken] = useState<string | null>(null);
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    const { data: device } = useGetDevice({ enabled: !!token });
    const authenticated = Boolean(device);

    const updateToken = useCallback(
        async (newToken: string | null) => {
            setToken(newToken);
            if (newToken) await storage.setItem(newToken);
            else if (storage.removeItem) await storage.removeItem();
        },
        [storage],
    );

    useEffect(() => {
        injectTokenResolver(() => token);
        injectTokenUpdater((token) => void updateToken(token));
    }, [token, updateToken]);

    useEffect(() => {
        async function hydrate() {
            try {
                const storedToken = await storage.getItem();
                setToken(storedToken);
            } finally {
                setIsInitialLoading(false);
            }
        }
        void hydrate();
    }, [storage]);

    return <AuthContext.Provider value={{ token, authenticated, isInitialLoading, updateToken }}>{children}</AuthContext.Provider>;
}
