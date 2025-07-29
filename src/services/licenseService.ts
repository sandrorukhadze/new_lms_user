import api from "../api/axios";
import type { LicenseInfo } from "../types/licenseInfo";

export const getLicenseInfo = async (): Promise<LicenseInfo> => {
  const response = await api.get<LicenseInfo>("/api/v1/license/info");
  return response.data;
};
