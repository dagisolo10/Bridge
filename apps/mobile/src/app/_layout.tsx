import "@/app/global.css";

import AppTabs from "@/components/layouts/app-tabs";
import { AuthProvider, SocketIoProvider, StorageAdapter } from "@package/react/providers";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DarkTheme, DefaultTheme, ThemeProvider } from "expo-router";
import * as SecureStore from "expo-secure-store";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const TOKEN_KEY = "TOKEN_KEY";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

const storage: StorageAdapter = {
    getItem: async () => await SecureStore.getItemAsync(TOKEN_KEY),
    removeItem: async () => await SecureStore.deleteItemAsync(TOKEN_KEY),
    setItem: async (token) => await SecureStore.setItemAsync(TOKEN_KEY, token),
};

export default function RootLayout() {
    const colorScheme = useColorScheme();

    return (
        <GestureHandlerRootView>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
                    <AuthProvider storage={storage}>
                        <SocketIoProvider>
                            <AppTabs />
                        </SocketIoProvider>
                    </AuthProvider>
                </ThemeProvider>
            </QueryClientProvider>
        </GestureHandlerRootView>
    );
}
