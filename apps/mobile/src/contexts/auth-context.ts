import { createContext, useContext } from "react";

type AuthContextType = {
    token: string | null;
    authenticated: boolean;
    updateToken: (token: string) => Promise<void> | void;
};

export const AuthContext = createContext<AuthContextType>({
    token: null,
    authenticated: false,
    updateToken: () => {},
});

export function useAuth() {
    return useContext(AuthContext);
}
