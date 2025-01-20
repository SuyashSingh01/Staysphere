import PlaceCard from '../components/Card/PlaceCard';
import {useSelector } from 'react-redux';
import { ListingsContext } from '../context/ListingsContext';
import { useContext } from 'react';
import HostedSkeleton from '../components/Skeleton/HostedSkeleton';

const HomePage = () => {

  // Access loading state from Redux
  const { loading } = useSelector((state) => state.auth);
  // const {listings }=useSelector((state)=>state.listings);

  const { listingData,searchItem }=useContext(ListingsContext);
  const listings= [...listingData];

  if (loading) {
    return (
      <div className="px-6 grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 sm:px-10 xl:px-[80px] gap-6 mt-2">
      {new Array (12).map((_, index) => (
        <HostedSkeleton key={index} />
      ))}
    </div>
    );
  }

  return (
    <div className="grid grid-cols-1 justify-items-center py-32 px-4 md:grid-cols-2 md:gap-4 lg:grid-cols-3 xl:grid-cols-4 xl:gap-10 ">
      {listings && listings.length > 0 ? (
        listings.filter(
          (val) => {
            // console.log(val)
            if (searchItem === "") {
              return val;
            } else if (val.title.toLowerCase().includes(searchItem.toLowerCase())) {
              return val;
            }
          }
        ).map((place, index) => <PlaceCard place={place} key={index} />)
      ) : (
        <div className="absolute left-1/2 right-1/2 top-40 flex  w-full -translate-x-1/2 transform flex-col p-10  md:w-1/2">
          <h1 className="text-3xl font-semibold">Result not found!</h1>
          <p className="text-lg font-semibold">
            Sorry, we couldn&#39;t find the place you&#39;re looking for.
          </p>
          <button className="mt-4 w-32 rounded-full bg-primary p-2 text-white">
            <a href="/" className="flex items-center justify-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Go back
            </a>
          </button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
