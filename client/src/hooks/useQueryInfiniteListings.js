import { useInfiniteQuery } from "@tanstack/react-query";
import { request } from "../services/apiConnector";
import { listingApis } from "../services/api.urls";
import { useSelector } from "react-redux";

const fetchListings = async ({ pageParam = 1, selectedCategory, search }) => {
  const response = await request(
    "GET",
    listingApis.GET_ALL_LISTINGS_API,
    null,
    null,
    {
      page: pageParam,
      limit: 8,
      category: selectedCategory,
      search,
    }
  );
  return response.data;
};

export const useInfiniteListings = () => {
  const { search, selectedCategory } = useSelector((state) => state.category);
  return useInfiniteQuery({
    queryKey: ["listings", selectedCategory, search],
    queryFn: ({ pageParam }) =>
      fetchListings({ pageParam, selectedCategory, search }),
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      return lastPage.totalPages >= nextPage ? nextPage : undefined;
    },
    enabled: !!selectedCategory,
  });
};
