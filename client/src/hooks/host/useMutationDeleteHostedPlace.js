import { useMutation, useQueryClient } from "@tanstack/react-query";
import { request } from "../../services/apiConnector";
import { hostApis } from "../../services/api.urls";
import { notification } from "antd";

const deletePlace = async ({ placeId, token }) => {
  const { data } = await request(
    "DELETE",
    `${hostApis.DELETE_PLACE}${placeId}`,
    null,
    { Authorization: `Bearer ${token}` }
  );
  return data;
};

export const useDeletePlace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePlace,
    onSuccess: () => {
      queryClient.invalidateQueries(["hostedPlaces"]);
      notification.success({
        message: "Place deleted successfully",
        duration: 1,
      });
    },
    onError: (error) => {
      console.error("Error deleting place:", error);
      notification.error({ message: "Failed to delete place" });
    },
  });
};
