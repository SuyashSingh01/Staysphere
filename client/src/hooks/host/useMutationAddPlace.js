import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { request } from "../../services/apiConnector";
import { hostApis } from "../../services/api.urls";
import { useSelector } from "react-redux";

// Fetch a single place details (for editing)
export const usePlaceDetails = (placeId) => {
  const { token } = useSelector((state) => state.auth);
  return useQuery({
    queryKey: ["hostPlace", placeId],
    queryFn: () =>
      request("GET", `${hostApis.GET_HOST_PLACE_BY_ID}/${placeId}`, null, {
        Authorization: `Bearer ${token}`,
      }),
  });
};

// Add a new place
export const useAddPlace = () => {
  const { token } = useSelector((state) => state.auth);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (placeData) =>
      request("POST", hostApis.ADD_PLACE, placeData, {
        Authorization: `Bearer ${token}`,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["hostPlaces"]);
    },
  });
};

// Update an existing place
export const useUpdatePlace = () => {
  const queryClient = useQueryClient();
  const { token } = useSelector((state) => state.auth);
  return useMutation({
    mutationFn: ({ placeId, updatedData }) =>
      request("PUT", `${hostApis.UPDATE_PLACE}/${placeId}`, updatedData, {
        Authorization: `Bearer ${token}`,
      }),
    onSuccess: (_, { placeId }) => {
      queryClient.invalidateQueries(["hostPlace", placeId]);
      queryClient.invalidateQueries(["hostPlaces"]);
    },
  });
};
