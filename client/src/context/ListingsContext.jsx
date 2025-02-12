import axios from "axios";
import { useState, createContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setListings } from "../Redux/slices/ListingSlice";
import { setLoading } from "../Redux/slices/AuthSlice";
import { request } from "../services/apiConnector";
// import { LISTING } from "../services/index.urls";
import { listingApis } from "../services/api.urls";
import { useMemo } from "react";

export const ListingsContext = createContext();

export const ListingsProvider = ({ children }) => {
  const dispatch = useDispatch();

  const { listings } = useSelector((state) => state.listings);
  const [searchItem, setSearchItem] = useState("");
  const [listingData, setlistingData] = useState(listings);

  const fetchedListingData = async () => {
    dispatch(setLoading(true));
    try {
      // const { data } = await request("GET", listingApis.GET_ALL_LISTINGS_API);
      // localStorage.setItem("listings", JSON.stringify(data.data));
      // setlistingData(data.data);
      // dispatch(setListings(listingData));
    } catch (e) {
      console.log(e.message);
    }
    dispatch(setLoading(false));
  };
  useEffect(() => {
    fetchedListingData();
  }, []);

  const value = {
    searchItem,
    setSearchItem,
    fetchedListingData,
    listingData,
    setlistingData,
  };
  return (
    <ListingsContext.Provider value={value}>
      {children}
    </ListingsContext.Provider>
  );
};
