import { Text } from "@/components/themed-text";
import { useSocketIo } from "@/contexts/socket.io-context";
import { useGetDevice, useRegisterDevice } from "@/hooks/tan-stack/use-device";
import { useColor } from "@/hooks/use-theme";
import Feather from "@expo/vector-icons/Feather";
import { cn } from "cn";
import { useState } from "react";
import { ActivityIndicator, Platform, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
    const color = useColor();
    const { connected } = useSocketIo();

    const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

    const { data: device, isLoading: isDeviceLoading, isError: isDeviceError, error: deviceError, refetch } = useGetDevice();

    const registerMutation = useRegisterDevice({
        onSuccess: async () => setFeedback({ type: "success", message: "Device registered successfully!" }),
        onError: (error) => setFeedback({ type: "error", message: error.message || "Failed to register device." }),
    });

    const defaultDeviceName = Platform.OS === "ios" ? "iPhone" : Platform.OS === "android" ? "Android Phone" : "Mobile Device";

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: color.background }}>
            <View className="flex-1 justify-between px-6 py-8">
                {/* Header & Status Section */}
                <View>
                    <View className="mb-6 flex-row items-center justify-between">
                        <View className="flex-1">
                            <Text className="text-2xl font-bold tracking-tight">Bridge Network</Text>
                            <Text className="mt-1 text-xs opacity-60">Connect this device to your Bridge LAN</Text>
                        </View>

                        {/* Socket Status Badge */}
                        <View
                            className={cn("flex-row items-center gap-2 rounded-full border px-3 py-1.5", connected ? "border-emerald-500/20 bg-emerald-500/10" : "border-rose-500/20 bg-rose-500/10")}
                        >
                            <View className={cn("h-2 w-2 rounded-full", connected ? "bg-emerald-500" : "bg-rose-500")} />
                            <Text className={cn("text-xs font-semibold", connected ? "text-emerald-500" : "text-rose-500")}>{connected ? "Connected" : "Offline"}</Text>
                        </View>
                    </View>

                    {/* Device Status Section */}
                    {isDeviceLoading ? (
                        <View className="mb-6 h-28 items-center justify-center rounded-2xl border border-blue-500/10 bg-blue-500/5 p-4">
                            <ActivityIndicator color={color.text} />
                            <Text className="mt-2 text-xs opacity-50">Fetching device status...</Text>
                        </View>
                    ) : isDeviceError ? (
                        /* Error State Block */
                        <View className="mb-6 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-5">
                            <View className="mb-2 flex-row items-center gap-2">
                                <Feather name="alert-triangle" size={18} color="#f43f5e" />
                                <Text className="text-sm font-bold text-rose-500">Failed to Fetch Device</Text>
                            </View>
                            <Text className="text-xs text-rose-400">{deviceError?.message || "Could not connect to the local server or retrieve device information."}</Text>
                            <Pressable onPress={() => refetch()} className="mt-3 self-start rounded-lg bg-rose-500/20 px-3 py-1.5 active:opacity-70">
                                <Text className="text-xs font-semibold text-rose-500">Retry Connection</Text>
                            </Pressable>
                        </View>
                    ) : device ? (
                        /* Registered Device Block */
                        <View className="mb-6 rounded-2xl border border-blue-500/20 bg-blue-500/10 p-5">
                            <View className="mb-3 flex-row items-center justify-between">
                                <Text className="text-[10px] font-bold tracking-widest text-blue-500 uppercase">Registered Device</Text>
                                <View className="rounded-full bg-blue-500/20 px-2.5 py-0.5">
                                    <Text className="text-[10px] font-semibold text-blue-500">{device.type}</Text>
                                </View>
                            </View>

                            <View className="flex-row items-center gap-3.5">
                                <View className="h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20">
                                    <Feather name={device.type === "Computer" ? "tv" : "smartphone"} size={22} color={color.text} />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-xl font-bold">{device.name}</Text>
                                    <Text className="text-xs opacity-60">Active and synchronized</Text>
                                </View>
                            </View>
                        </View>
                    ) : (
                        /* Empty Device State Block */
                        <View className="mb-6 items-center justify-center rounded-2xl border border-dashed border-neutral-700/30 bg-neutral-500/5 p-6">
                            <View className="mb-2 h-10 w-10 items-center justify-center rounded-full bg-neutral-500/10">
                                <Feather name="wifi-off" size={18} color={color.text} style={{ opacity: 0.5 }} />
                            </View>
                            <Text className="text-sm font-medium opacity-80">No Device Registered</Text>
                            <Text className="mt-0.5 text-center text-xs opacity-50">Register this phone to start communicating</Text>
                        </View>
                    )}

                    {/* Feedback Alert Banner */}
                    {feedback && (
                        <View
                            className={cn(
                                "mb-6 flex-row items-center gap-3 rounded-xl border p-4",
                                feedback.type === "success" ? "border-emerald-500/20 bg-emerald-500/10" : "border-rose-500/20 bg-rose-500/10",
                            )}
                        >
                            <Feather name={feedback.type === "success" ? "check-circle" : "alert-circle"} size={18} color={feedback.type === "success" ? "#10b981" : "#f43f5e"} />
                            <Text className={cn("flex-1 text-sm font-medium", feedback.type === "success" ? "text-emerald-500" : "text-rose-500")}>{feedback.message}</Text>
                        </View>
                    )}
                </View>

                {/* Actions Section */}
                <View className="gap-3">
                    <Pressable
                        onPress={() => registerMutation.mutate({ name: defaultDeviceName, type: "Phone" })}
                        disabled={registerMutation.isPending}
                        className="h-13 w-full flex-row items-center justify-center gap-2 rounded-xl bg-blue-600 active:opacity-80 disabled:opacity-70"
                    >
                        {registerMutation.isPending ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <>
                                <Feather name="plus-circle" size={18} color="#fff" />
                                <Text className="text-base font-semibold text-white">Register Device</Text>
                            </>
                        )}
                    </Pressable>

                    <Pressable
                        onPress={() => refetch()}
                        disabled={isDeviceLoading}
                        className="h-13 w-full flex-row items-center justify-center gap-2 rounded-xl border border-neutral-700/30 bg-neutral-500/10 active:opacity-80 disabled:opacity-70"
                    >
                        {isDeviceLoading ? (
                            <ActivityIndicator color={color.text} />
                        ) : (
                            <>
                                <Feather name="refresh-cw" size={16} color={color.text} />
                                <Text className="text-base font-semibold">Refetch Status</Text>
                            </>
                        )}
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    );
}
