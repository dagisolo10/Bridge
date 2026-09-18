export type Device = {
    id: string;
    name: string;
    type: DeviceType;
    createdAt: string;
    updatedAt: string;
};

export type Peer = {
    id: string;
    peerId: string;
    parentId: string;
    createdAt: string;
    updatedAt: string;
    isBlocked: boolean;
};

export type PeerRequest = {
    id: string;
    peerId: string;
    parentId: string;
    accepted: boolean;
    createdAt: string;
    updatedAt: string;
    resolvedAt: string | null;
};

export type Rule = {
    id: string;
    key: RuleKey;
    name: string;
    isDefault: boolean;
    isAllowed: boolean;
    description: string | null;
};

export type DeviceType = "Phone" | "Computer";

export type RuleKey = "FILE_SHARING" | "AUDIO_STREAM" | "SYSTEM_POWER" | "MEDIA_CONTROL" | "VOLUME_CONTROL" | "CLIPBOARD_SYNC" | "MOUSE_TRACKPAD" | "KEYBOARD_TYPEPAD" | "FILE_SYSTEM_ACCESS";
