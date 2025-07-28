import api from "../api/axios";
import type { AcquireLicensePayload, AcquireLicenseResponse } from "../types/acquire";

export const acquireLicense = async (
  payload: AcquireLicensePayload
): Promise<AcquireLicenseResponse> => {
  const response = await api.post<AcquireLicenseResponse>(
    "/api/v1/license",
    payload
  );
  return response.data;
};
