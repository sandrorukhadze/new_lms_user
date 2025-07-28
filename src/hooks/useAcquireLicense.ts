import { useMutation } from "@tanstack/react-query";
import type {
  AcquireLicensePayload,
  AcquireLicenseResponse,
} from "../types/acquire";
import { acquireLicense } from "../services/acquireService";

export const useAcquireLicense = () => {
  return useMutation<AcquireLicenseResponse, Error, AcquireLicensePayload>({
    mutationFn: acquireLicense,
  });
};
