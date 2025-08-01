import { useQuery } from "@tanstack/react-query";
import { getLicenseInfo } from "../services/licenseService";

export const useLicenseInfo = () => {
  return useQuery({
    queryKey: ["licenseInfo"],
    queryFn: getLicenseInfo,
    refetchInterval: 15000, 
  });
};
