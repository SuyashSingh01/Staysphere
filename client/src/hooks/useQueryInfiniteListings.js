import { useInfiniteQuery } from "@tanstack/react-query";
import { request } from "../services/apiConnector";
import { listingApis } from "../services/api.urls";

const fetchListings = async ({ pageParam = 1 }) => {
  const response = await request(
    "GET",
    listingApis.GET_ALL_LISTINGS_API,
    null,
    null,
    {
      page: pageParam,
      limit: 8,
    }
  );
  return response.data;
};

export const useInfiniteListings = () => {
  return useInfiniteQuery({
    queryKey: ["listings"],
    queryFn: ({ pageParam }) => fetchListings({ pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      return lastPage.totalPages >= nextPage ? nextPage : undefined;
    },
  });
};
