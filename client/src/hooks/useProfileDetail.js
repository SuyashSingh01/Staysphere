import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { request } from "../services/apiConnector";
import { profileApis } from "../services/api.urls";
import { useSelector } from "react-redux";

export const useProfile = () => {
  const { token } = useSelector((state) => state.auth);
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } = await request("GET", profileApis.GET_PROFILE_API, null, {
        Authorization: `Bearer ${token}`,
      });
      return data.data;
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { token } = useSelector((state) => state.auth);
  return useMutation({
    mutationFn: async (updatedData) => {
      const response = await request(
        "PUT",
        profileApis.UPDATE_PROFILE_API,
        updatedData,
        { Authorization: `Bearer ${token}` }
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["profile"]);
    },
  });
};
