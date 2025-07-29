import api from "../api/axios";
import type { UserInfo } from "../types/userInfo";

export const getUserInfo = async (): Promise<UserInfo> => {
  const response = await api.get<UserInfo>("/api/v1/user/me");
  return response.data;
};
