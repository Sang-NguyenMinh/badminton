import { EXPO_PUBLIC_API_URL } from "@/configs/config";
import axiosCustome from "../libs/axios";
import { AxiosRequestConfig } from "axios";
import { IProfile } from "@/configs/type";

export const CourtAPIs = {
    ENDPOINT: EXPO_PUBLIC_API_URL,
    getCourtDetail:  async (data:{facilityId:string,date:string}) => {
        return axiosCustome.get<any>(`${EXPO_PUBLIC_API_URL}/courts/${data.facilityId}/${data.date}`, { requiresToken: false } as AxiosRequestConfig);
      },

      getCourtsByFacilityId: async  (params:{facilityId:string,date:string,startTime:string|null,endTime:string|null}): Promise<any> => {
        return axiosCustome.get<any>(`${EXPO_PUBLIC_API_URL}/courts/?facilityId=${params.facilityId}&date=${params.date}&startTime=${params.startTime}&endTime=${params.endTime}`, { requiresToken: true } as AxiosRequestConfig);
      },
    }