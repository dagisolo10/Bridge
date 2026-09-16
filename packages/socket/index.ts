export type Command = "play_pause" | "audio_stop" | "audio_next" | "audio_prev" | "audio_vol_up" | "audio_vol_down";
export type TypePadKey = "char" | "backspace" | "enter" | "tab" | "escape" | "delete" | "up" | "down" | "left" | "right";

export interface ClientToDaemonEvents {
    "window:sleep": () => void;
    "window:shutdown": () => void;
    "window:launch": (data: { path: string }) => void;
    "window:set_brightness": (data: { level: number }) => void;

    "media:potplayer": (data: { command: Command }) => void;

    "clipboard:phone:push": (data: { text: string }) => void;

    "trackpad:move": (data: { dx: number; dy: number }) => void;
    "trackpad:toggle": (data: { state: "down" | "up" }) => void;
    "trackpad:click": (data: { button: "left" | "right" }) => void;

    "volume:toggle": () => void;
    "volume:get:value": () => void;
    "volume:get:is_muted": () => void;
    "volume:set": (data: { level: number }) => void;

    "audio-stream": (data: { base64Data: string }) => void;

    "typepad:phone:stroke": (data: { key: TypePadKey; value?: string }) => void;
}

export interface DaemonToClientEvents {
    "token:new": (data: { newToken: string }) => void;
    "typepad:pc:stroke": (data: { key: string }) => void;

    "volume:value": (data: { volume: number }) => void;
    "volume:toggled": (data: { isMuted: boolean }) => void;
    "volume:is_muted": (data: { isMuted: boolean }) => void;

    "clipboard:pc:changed": (data: { text: string }) => void;
}

export type ClientToDaemonEvent = keyof ClientToDaemonEvents;
export type DaemonToClientEvent = keyof DaemonToClientEvents;

export type ClientToDaemonData<Event extends ClientToDaemonEvent> = Parameters<ClientToDaemonEvents[Event]>[0];
export type DaemonToClientData<Event extends DaemonToClientEvent> = Parameters<DaemonToClientEvents[Event]>[0];
