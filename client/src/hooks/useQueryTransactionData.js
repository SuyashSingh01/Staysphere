import { useQuery } from "@tanstack/react-query";
import { request } from "../services/apiConnector";
import { useSelector } from "react-redux";
import { profileEndpoints } from "../services/api.urls";

const fetchTransactions = async (token) => {
  const { data } = await request(
    "GET",
    profileEndpoints.GET_TRANSACTIONS_API,
    null,
    {
      Authorization: `Bearer ${token}`,
    }
  );
  return data.data;
};

export const useTransactions = () => {
  const token = useSelector((state) => state.auth.token);
  return useQuery({
    queryKey: ["transactions"],
    queryFn: () => fetchTransactions(token),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};
