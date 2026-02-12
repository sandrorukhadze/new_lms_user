import { useQueryClient } from "@tanstack/react-query";
import { useWorkerInterval } from "../hooks/useWorkerInterval";

export const LicensePoller = () => {
  const queryClient = useQueryClient();

  useWorkerInterval(() => {
    queryClient.invalidateQueries({ queryKey: ["licenseInfo"] });
  }, 15000);

  return null;
};
