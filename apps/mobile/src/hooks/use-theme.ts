import { Colors } from "@/constants/theme";
import { useColorScheme } from "react-native";

export function useColor() {
    const scheme = useColorScheme();
    const theme = scheme === "light" ? "light" : "dark";

    return Colors[theme];
}
