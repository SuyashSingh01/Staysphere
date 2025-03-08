import { useRef, useCallback, useMemo, memo } from "react";
import PlaceCard from "../components/Card/PlaceCard";
import ListingLoader from "../components/Skeleton/ListingLoader";
import { useInfiniteListings } from "../hooks/useQueryInfiniteListings";

const HomePage = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isLoading,
  } = useInfiniteListings();

  const observer = useRef();
  const lastListingRef = useCallback(
    (node) => {
      if (isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  );
  const listings = useMemo(() => {
    return data?.pages?.flatMap((page) => page.places) || [];
  }, [data]);

  if (isLoading) {
    return (
      <div className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 mt-10 px-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <ListingLoader key={`loader-${index}`} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 justify-items-center py-32 px-4 md:grid-cols-2 md:gap-4 lg:grid-cols-3 xl:grid-cols-4 xl:gap-10 mt-[30px] ">
      {listings?.map((place, index) => {
        const isLastItem = index === listings.length - 1;
        return (
          <PlaceCard
            ref={isLastItem ? lastListingRef : null}
            place={place}
            key={place?._id}
          />
        );
      })}

      {isFetchingNextPage && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <ListingLoader key={`loader-${index}`} />
          ))}
        </div>
      )}
    </div>
  );
};

export default memo(HomePage);
