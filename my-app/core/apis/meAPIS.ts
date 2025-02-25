import { EXPO_PUBLIC_API_URL } from "@/configs/config";
import axiosCustome from "../libs/axios";
import { AxiosRequestConfig } from "axios";
import { IProfile } from "@/configs/type";

export const MeAPIs = {
    ENDPOINT: EXPO_PUBLIC_API_URL,
    getProfile:  async (): Promise<IProfile> => {
        return axiosCustome.get<any>(`${EXPO_PUBLIC_API_URL}/users/me`, { requiresToken: true } as AxiosRequestConfig);
      },

    }