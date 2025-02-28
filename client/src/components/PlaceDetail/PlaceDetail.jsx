import Perks from "./Perks.jsx";
import { notification } from "antd";
import Reviews from "../common/Reviews.jsx";
import { useParams } from "react-router-dom";
import PlaceGallery from "../common/PlaceGallery.jsx";
import React, { useEffect, useState, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../Redux/slices/AuthSlice";
import AddressLink from "./AddressLink.jsx";
import ReviewCategorieSection from "./ReviewCategorieSection.jsx";
import { setOpenChat } from "../../Redux/slices/ChatSlice.js";
import star_icon from "../../assets/icons/star-icon.svg";
import bag_icon from "../../assets/icons/bag.svg";
import { listingApis } from "../../services/api.urls";
import music_icon from "../../assets/icons/music.svg";
import Bookmark_icon from "../../assets/icons/Bookmark-icon.svg";
import { request } from "../../services/apiConnector.js";
import { LoadingSpinner } from "../Wrapper/PageWrapper.jsx";
import BookingSummaryCard from "./Booking/Bookingsummary.jsx";
import { Divider } from "@mui/joy";
import ChatModal from "../Chat/chatModal.jsx";

// import BookingWidget from "./BookingWidget.jsx";

const PlaceDetail = () => {
  const { id } = useParams();
  const [place, setPlace] = useState({});
  const { loading, user } = useSelector((state) => state.auth);
  const { openChat } = useSelector((state) => state.chat);
  console.log("chat modal", openChat);
  const dispatch = useDispatch();

  const connecthostHandler = () => {
    console.log("connecthostHandler", openChat);
    if (user) {
      dispatch(setOpenChat(true));
    }
  };
  const getPlaceDetail = async () => {
    dispatch(setLoading(true));
    try {
      const { data } = await request(
        "GET",
        listingApis.GET_LISTING_DETAILS_API + `/${id}`
      );
      console.log("LISTINGDETAIL", data);
      const placeDetail = data.data;
      setPlace(placeDetail);
    } catch (e) {
      console.log("eror ", e.message);
      notification.error({
        message: e.message,
        durations: 2,
        placement: "bottomRight",
      });
    }
    dispatch(setLoading(false));
  };
  useEffect(() => {
    getPlaceDetail();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  return (
    <div className="mt-4 overflow-x-hidden px-8 md:pt-16">
      <h1 className="text-3xl mt-2 ">{place?.placeName}</h1>
      <AddressLink className="my-2 block" placeAddress={place?.placeLocation} />
      <PlaceGallery place={place.image} />
      <div className="sm:my-4 md:mt-8 md:mb-8 flex flex-col md:flex-row justify-between ">
        <div className=" ">
          <div className="my-4 max-w-[700px]">
            <h2 className="md:text-2xl font-semibold text-xl ">Description</h2>
            {place?.description}
          </div>
          Max number of guests: {place?.maxGuests}
          <Divider width="100%" height="4px" />
          <Perks perks={place?.amenities} />
        </div>
        {/* <div className="sm:w-full md:w-[35%] sticky top-0">
          <BookingWidget place={place} />
        </div> */}
        <div className=" w-[100%] md:w-[34%] pt-8 relative sm:block ">
          <BookingSummaryCard
            originalPrice={place?.price}
            discountedPrice={2}
            place={place}
          />
        </div>
      </div>

      <div className="mt-4">
        <ReviewCategorieSection Rating={place.rating} />
        <Reviews reviews={place.reviews} place={place} />
      </div>
      {/*----------------- message section--------- */}

      <section className="xl:mx-[160px] sm:mx-10 px-6 py-12  border-gray-300 border-b">
        <h1 className="text-[24px] font-semibold">Meet your Host</h1>
        <div className="flex lg:flex-row flex-col gap-12">
          <div className="flex sm:w-[380px] w-full flex-col">
            <div
              className="flex mt-6 mb-8 sm:gap-16 gap-12 items-center  rounded-3xl bg-white  py-6 sm:px-10 px-8"
              style={{ boxShadow: "rgba(0, 0, 0, 0.24) 0px 2px 8px 2px" }}
            >
              <div className="flex flex-col items-center ">
                <div
                  className={`flex items-center bg-black justify-center text-white w-20 h-20 text-4xl font-semibold rounded-full`}
                >
                  {/* <span>
                    {hostDetails?.username && hostDetails?.username.slice(0, 1)}
                  </span> */}
                </div>
                {/* <h2 className="font-semibold sm:text-3xl text-2xl mt-2">
                  {hostDetails?.username && hostDetails?.username.split(" ")[0]}
                </h2> */}
                <p>Host</p>
              </div>
              <div className="flex-1">
                <div className="flex flex-col pb-3 border-b border-gray-300">
                  <span className="text-2xl font-semibold ">84</span>
                  <span className="text-xs">Reviews</span>
                </div>
                <div className="flex flex-col py-3 border-b border-gray-300">
                  <span className="text-2xl font-semibold flex items-center gap-2">
                    4.51{" "}
                    <img className="w-4 h-4" src={star_icon} alt="star_icon" />
                  </span>
                  <span className="text-xs">Rating</span>
                </div>
                <div className="flex flex-col pt-3">
                  <span className="text-2xl font-semibold ">3</span>
                  <span className="text-xs">Years hosting</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3 items-center mb-4">
              <img className="w-6 " src={bag_icon} alt="bag_icon" />
              <p>My work: StayVista Explorer</p>
            </div>
            <div className="flex gap-3 mb-8 items-center">
              <img className="w-6 " src={music_icon} alt="music_icon" />
              <p>Favourite song in secondary school: Rock Your Body</p>
            </div>
            <p>
              Howdy fellow adventurers! I’m Gursimran, your mountain host from
              StayVista. With a love for...
            </p>
            <button className="underline flex gap-2 items-center font-semibold text-lg mt-4 bg-white">
              <span>Show more</span>
              <img
                className="w-3"
                src="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2016%2016'%20aria-hidden='true'%20role='presentation'%20focusable='false'%20style='display:%20block;%20height:%2012px;%20width:%2012px;%20fill:%20currentcolor;'%3e%3cpath%20d='M5.41.3%204%201.7%2010.3%208%204%2014.3l1.41%201.4%206.6-6.58c.57-.58.6-1.5.1-2.13l-.1-.11z'%3e%3c/path%3e%3c/svg%3e"
                alt="arrow_icon"
              />
            </button>
          </div>

          <div className="flex-1 xl:mr-12">
            <div className="border-b pb-10 border-gray-300">
              <h2 className="text-xl font-semibold mb-4 mt-7">Host details</h2>
              <p>Response rate: 100%</p>
              <p>Responds within a few hours</p>
              <button
                className="px-6 rounded-lg mt-8 font-semibold text-lg py-3 bg-black text-white"
                onClick={connecthostHandler}
              >
                Message Host
              </button>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <img src={Bookmark_icon} className="w-6" alt="Bookmark_icon" />
              <p className="text-[13px]">
                To protect your payment, never transfer money or communicate
                outside of the Staysphere website or app.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section>
        {openChat && <ChatModal userId={user?.id} hostId={place?.host} />}
      </section>

      {/* --------------------------------------- */}

      <div className="mt-4 mb-4">
        <iframe
          width="100%"
          height="600"
          src="https://maps.google.com/maps?width=100%&amp;height=600&amp;hl=en&amp;coord=52.70967533219885, -8.020019531250002&amp;q=1%20Grafton%20Street%2C%20Dublin%2C%20Ireland&amp;ie=UTF8&amp;t=&amp;z=14&amp;iwloc=B&amp;output=embed"
          frameBorder="0"
          scrolling="no"
          marginHeight="0"
          marginWidth="0"
          title="Place Location"
        ></iframe>
        <br />
      </div>
    </div>
  );
};

export default memo(PlaceDetail);
