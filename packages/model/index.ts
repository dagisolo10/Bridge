export type Device = {
    id: string;
    name: string;
    type: DeviceType;
    createdAt: string;
    updatedAt: string;
};

export type DeviceType = "Phone" | "Computer";
