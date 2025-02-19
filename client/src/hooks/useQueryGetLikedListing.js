import { useQuery } from "@tanstack/react-query";
import { request } from "../services/apiConnector"; // Axios request function
import { favoriteApis } from "../services/api.urls";
import { useSelector } from "react-redux";

const fetchLikedPlaces = async ({ queryKey }) => {
  const [likedPlaceIds, token] = queryKey;

  if (!likedPlaceIds || likedPlaceIds.length === 0) {
    return [];
  }

  const { data } = await request(
    "GET",
    favoriteApis.GET_FAVORITE,
    { placeIds: likedPlaceIds },
    { Authorization: `Bearer ${token}` }
  );

  return data;
};

export const useLikedPlaces = () => {
  const likedPlaces = useSelector((state) => state.listings.favorites); // Get liked places IDs
  const { token } = useSelector((state) => state.auth); // Get auth token

  return useQuery({
    queryKey: ["likedPlaces", likedPlaces, token], // Unique query key
    queryFn: fetchLikedPlaces,
    enabled: !!likedPlaces.length && !!token, // Only run if there are liked places and a token
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
  });
};
