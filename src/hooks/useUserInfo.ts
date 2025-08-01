import { useQuery } from "@tanstack/react-query";
import { getUserInfo } from "../services/userService";

export const useUserInfo = () => {
  return useQuery({
    queryKey: ["user-info"],
    queryFn: getUserInfo,
    staleTime: 1000 * 60 * 5,
  });
};
