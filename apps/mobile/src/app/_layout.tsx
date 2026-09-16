import "@/app/global.css";

import AppTabs from "@/components/layouts/app-tabs";
import AuthProvider from "@/providers/auth-provider";
import SocketIoProvider from "@/providers/socket.io-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DarkTheme, DefaultTheme, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
    const colorScheme = useColorScheme();

    return (
        <GestureHandlerRootView>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
                    <AuthProvider>
                        <SocketIoProvider>
                            <AppTabs />
                        </SocketIoProvider>
                    </AuthProvider>
                </ThemeProvider>
            </QueryClientProvider>
        </GestureHandlerRootView>
    );
}
