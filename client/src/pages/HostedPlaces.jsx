import { useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import HostedSkeleton from "../components/Skeleton/HostedSkeleton";
import InfoCard from "../components/Card/InfoCard";
import { useHostedPlaces } from "../hooks/host/useQueryHostedPlace";

const HostedPlaces = () => {
  const navigate = useNavigate();

  const { data, isLoading, error } = useHostedPlaces();

  const places = useMemo(() => data?.data ?? [], [data]);
  console.log("Hostedplaces", places);

  if (isLoading) {
    return (
      <div className="mx-4 mt-4 flex flex-col justify-center gap-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <HostedSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-center text-red-500 mt-4">
        Failed to load listings. Please try again later.
      </p>
    );
  }

  return (
    <div className="mt-4 mb-8">
      <h1 className="font-semibold text-3xl mt-4 mb-4 text-center">
        Your Hosted Places
      </h1>
      <div className="mx-4 mt-4 flex flex-col justify-center flex-wrap gap-4 w-full">
        {places?.length > 0 ? (
          places.map((place, index) => (
            <InfoCard place={place} navigate={navigate} key={place?._id} />
          ))
        ) : (
          <p className="text-center text-gray-500">No hosted places found.</p>
        )}
      </div>
      <div className="text-center mt-4 mb-4">
        <Link
          className="gap-1 m-11 inline-flex rounded-full bg-orange-500 active:bg-orange-600 py-3 px-5 md:px-13 text-xl font-semibold text-white"
          to={"/account/places/new"}
        >
          Add new place
        </Link>
      </div>
    </div>
  );
};

export default HostedPlaces;
