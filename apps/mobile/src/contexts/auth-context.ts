import { createContext, useContext } from "react";

type AuthContextType = {
    token: string | null;
    updateToken: (token: string) => Promise<void> | void;
};

export const AuthContext = createContext<AuthContextType>({
    token: null,
    updateToken: () => {},
});

export function useAuth() {
    return useContext(AuthContext);
}
