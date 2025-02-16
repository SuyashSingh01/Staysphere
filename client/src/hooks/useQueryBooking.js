import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { request } from "../services/apiConnector";
import { bookingsApis } from "../services/api.urls";
import { useSelector } from "react-redux";

// Fetch all bookings
export const useBookings = () => {
  const token = useSelector((state) => state.auth.token);

  return useQuery({
    queryKey: ["bookings"], // Unique key for caching
    queryFn: async () => {
      const { data } = await request(
        "GET",
        bookingsApis.GET_ALL_BOOKINGS,
        null,
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      );
      return data?.data;
    },
    staleTime: 1000 * 60 * 5, // Cache results for 5 minutes
  });
};

// Add a new booking
export const useAddBooking = () => {
  const queryClient = useQueryClient();
  const token = useSelector((state) => state.auth.token);

  return useMutation({
    mutationFn: (newBooking) =>
      request("POST", bookingsApis.ADD_BOOKING, newBooking, {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["bookings"]); // Refetch bookings after adding
    },
  });
};
