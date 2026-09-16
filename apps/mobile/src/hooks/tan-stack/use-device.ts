import { useAuth } from "@/contexts/auth-context";
import { queryKeys } from "@/hooks/tan-stack/query-keys";
import { api } from "@/lib/api/axios";
import { requestApi } from "@/lib/api/request";
import { TMutationOptions, TQueryOptions } from "@/types/options";
import { Device, DeviceType } from "@package/model";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetDevice<Data = Device>(options?: TQueryOptions<Data>) {
    return useQuery({
        ...options,
        queryKey: queryKeys.device.get(),
        queryFn: async () => requestApi(() => api.get<Data>("/device")),
    });
}

type RegisterDeviceResponse = { device: Device; token: string };
type RegisterDevicePayload = { name: string; type: DeviceType };

export function useRegisterDevice(options?: TMutationOptions<RegisterDeviceResponse, RegisterDevicePayload>) {
    const { updateToken } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        ...options,
        mutationFn: async (data) => requestApi(() => api.post<RegisterDeviceResponse>("/device", data)),
        onSuccess: async (data, variables, onMutateResult, context) => {
            await updateToken(data.token);

            queryClient.invalidateQueries({ queryKey: queryKeys.device.get() });

            if (options?.onSuccess) options.onSuccess(data, variables, onMutateResult, context);
        },
    });
}
