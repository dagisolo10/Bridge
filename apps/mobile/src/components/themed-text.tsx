import { cn } from "cn";
import { Text as ReactNativeText, type TextProps } from "react-native";

export function Text({ className, ...rest }: TextProps) {
    return <ReactNativeText className={cn("text-foreground font-semibold", className)} {...rest} />;
}
