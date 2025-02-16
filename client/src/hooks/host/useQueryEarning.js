import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSelector } from "react-redux";

export const useEarnings = () => {
  const hostId = useSelector((state) => state.auth.user.id);

  return useQuery({
    queryKey: ["hostEarnings", hostId],
    queryFn: async () => {
      const { data } = await axios.get(
        `http://localhost:4001/api/v1/host/earnings/${hostId}`
      );
      return data;
    },
  });
};

export const useRequestPayout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await axios.post("/api/host/request-payout");
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["hostEarnings"]);
    },
  });
};
