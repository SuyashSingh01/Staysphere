import { useQuery } from "@tanstack/react-query";
import { request } from "../../services/apiConnector";
import { hostApis } from "../../services/api.urls";
import { useSelector } from "react-redux";

const fetchHostedPlaces = async (token) => {
  const { data } = await request("GET", hostApis.GET_ALL_PLACES, null, {
    Authorization: `Bearer ${token}`,
  });
  return data;
};

export const useHostedPlaces = () => {
  const { token } = useSelector((state) => state.auth);
  return useQuery({
    queryKey: ["hostedPlaces"],
    queryFn: () => fetchHostedPlaces(token),
    staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
    retry: 2, // Retry twice on failure
  });
};
