import { EXPO_PUBLIC_API_URL } from "@/configs/config";
import axiosCustome from "../libs/axios";
import { AxiosRequestConfig } from "axios";
import { IProfile } from "@/configs/type";

export const SocialMediaAPIs = {
  ENDPOINT: EXPO_PUBLIC_API_URL,
  createPost: async (formData: FormData): Promise<any> => {
    return axiosCustome.postFormData<any>(
      `${EXPO_PUBLIC_API_URL}/posts`,
      formData,
      {
        requiresToken: true,
      } as AxiosRequestConfig
    );
  },

  getPost: async (param: {
    current?: number;
    pageSize?: number;
    keyword?: string;
    status?: string;
  }) => {
    const res = await axiosCustome.get<any>(
      `${EXPO_PUBLIC_API_URL}/posts?current=${param.current ?? 1}&pageSize=${
        param.pageSize ?? 10
      }`,
      { requiresToken: true } as AxiosRequestConfig
    );
    return res;
  },
};
