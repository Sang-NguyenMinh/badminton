import { EXPO_PUBLIC_API_URL } from "@/configs/config";
import axiosCustome from "../libs/axios";
import { AxiosRequestConfig } from "axios";
import { IProfile } from "@/configs/type";

export interface IMessageParams {
    senderId: string | number|undefined,
    conversationId: string,
    content: string,
    messageType: 'text' | 'image' | 'file',
    fileUrl?: string,
}

export const MessagesAPIs = {
    ENDPOINT: EXPO_PUBLIC_API_URL,
    getMessagesByConservationId: async (conservationId: string): Promise<any> => {
        return axiosCustome.get<any>(`${EXPO_PUBLIC_API_URL}/conversations/${conservationId}/messages`, { requiresToken: true } as AxiosRequestConfig);
    },

    sendMessage: async (data: IMessageParams): Promise<any> => {
        return axiosCustome.post<any>(`${EXPO_PUBLIC_API_URL}/conversations/messages`, data, { requiresToken: true } as AxiosRequestConfig);
    },
}