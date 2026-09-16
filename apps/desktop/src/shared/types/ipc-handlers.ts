type IpcHandler<ReturnType = void, Args = []> = {
    args: Args;
    return: ReturnType;
};

export type IpcHandlers = {
    "auth:clear-token": IpcHandler;
    "auth:get-token": IpcHandler<string | null>;
    "auth:set-token": IpcHandler<void, [{ token: string }]>;
};
