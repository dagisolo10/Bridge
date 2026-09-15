import { create } from "axios";

const baseURL = "http://192.168.8.101:3000";

export const api = create({ withCredentials: true, baseURL });
