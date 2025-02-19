import React, { memo, useMemo } from "react";
import { useSelector } from "react-redux";
import PlaceCard from "../components/Card/PlaceCard.jsx";
import ExploreCard from "../components/common/ExploreCard.jsx";
import { useLikedPlaces } from "../hooks/useQueryGetLikedListing.js";

const LikedPlacesPage = () => {
  const likedPlaces = useSelector((state) => state.listings.favorites);
  const { data } = useLikedPlaces(likedPlaces);
  const likedListings = useMemo(() => {
    return data ?? [];
  }, [data]);
  return (
    <div className=" min-h-screen bg-gray-50 py-8 px-4 md:px-8 lg:px-16 ">
      {likedListings.length > 0 ? (
        <>
          <h1 className="mb-8 text-center text-3xl font-bold text-gray-800">
            Liked Places
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 md:gap-8  ">
            {likedListings.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        </>
      ) : (
        <ExploreCard
          title={"Liked Place"}
          explore={
            "You haven’t liked any places yet. Explore and add your favorites!"
          }
        />
      )}
    </div>
  );
};

export default memo(LikedPlacesPage);
