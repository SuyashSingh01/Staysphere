import Lottie from "lottie-react";
import React, { lazy } from "react";
import Layout from "./components/Layout";
import { useSelector } from "react-redux";
import { AnimatePresence } from "framer-motion";
import { ACCOUNT_TYPE } from "./constants/constants.js";
import PrivateRoute from "./components/PrivateRoute.jsx";
import { Routes, Route, useLocation } from "react-router-dom";
import animationData from "./assets/animation/success.json";
import UpdatePassword from "./components/Auth/Updatepassword.jsx";
import ForgotPassword from "./components/Auth/ForgotPassword.jsx";
import { PageWrapper } from "./components/Wrapper/PageWrapper.jsx";

// lazy loading pages
const HomePage = lazy(() => import("./pages/HomePage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const HostedPlaces = lazy(() => import("./pages/HostedPlaces.jsx"));
const BookingsPage = lazy(() => import("./pages/BookingsPage.jsx"));
const Notification = lazy(() => import("./components/Navbar/Notification.jsx"));
const HostPlacesFormPage = lazy(() => import("./pages/HostPlacesFormPage.jsx"));
const SingleBookedPlace = lazy(() => import("./pages/SingleBookedPlace.jsx"));
const PlaceDetail = lazy(() =>
  import("./components/PlaceDetail/PlaceDetail.jsx")
);
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const ConfirmAndPay = lazy(() => import("./pages/ConfirmAndPay.jsx"));
const BookingRequest = lazy(() =>
  import("./components/common/BookingRequest.jsx")
);
const FavouritePlaces = lazy(() => import("./pages/FavouritePlaces.jsx"));
const Chat = lazy(() => import("./components/Chat/Chat.jsx"));

function App() {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              // <PageWrapper>
              <HomePage />
              // </PageWrapper>
            }
          />
          <Route
            path="/login"
            element={
              <PageWrapper>
                <LoginPage />
              </PageWrapper>
            }
          />
          <Route
            path="/register"
            element={
              <PageWrapper>
                <SignupPage />
              </PageWrapper>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PageWrapper>
                <ForgotPassword />
              </PageWrapper>
            }
          />
          <Route
            path="/update-password/:token"
            element={
              <PageWrapper>
                <UpdatePassword />
              </PageWrapper>
            }
          />
          <Route
            path="/place/:id"
            element={
              <PageWrapper>
                <PlaceDetail />
              </PageWrapper>
            }
          />
          <Route
            path="/account/bookings/:id/confirm-pay"
            element={
              <PrivateRoute>
                <PageWrapper>
                  <ConfirmAndPay />
                </PageWrapper>
              </PrivateRoute>
            }
          />
          <Route
            path="/paymentsuccess"
            element={
              <PrivateRoute>
                <PageWrapper>
                  <Lottie
                    animationData={animationData}
                    style={{ width: "300px", height: "300px" }}
                  />
                </PageWrapper>
              </PrivateRoute>
            }
          />
          <Route
            path="/account/bookings/:id"
            element={
              <PrivateRoute>
                <PageWrapper>
                  <SingleBookedPlace />
                </PageWrapper>
              </PrivateRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <PrivateRoute>
                <PageWrapper>
                  <Chat />
                </PageWrapper>
              </PrivateRoute>
            }
          />
          {/* Only accessible to Host in first Layout */}
          {user?.role === ACCOUNT_TYPE.HOST && (
            <>
              <Route
                path="/account/places/new"
                element={
                  <PrivateRoute>
                    <PageWrapper>
                      <HostPlacesFormPage />
                    </PageWrapper>
                  </PrivateRoute>
                }
              />
              <Route
                path="/account/places"
                element={
                  <PrivateRoute>
                    <PageWrapper>
                      <HostedPlaces />
                    </PageWrapper>
                  </PrivateRoute>
                }
              />
              <Route
                path="/account/hosted/bookings"
                element={
                  <PrivateRoute>
                    <PageWrapper>
                      <BookingRequest />
                    </PageWrapper>
                  </PrivateRoute>
                }
              />
              <Route
                path="/account/places/:placeId"
                element={
                  <PrivateRoute>
                    <PageWrapper>
                      <HostPlacesFormPage />
                    </PageWrapper>
                  </PrivateRoute>
                }
              />
            </>
          )}
        </Route>
        {/* ---------------Second layout for Dashboard----------------------------- */}

        <Route
          path="/account"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route
            index
            element={
              <PrivateRoute>
                <PageWrapper>
                  <ProfilePage />
                </PageWrapper>
              </PrivateRoute>
            }
          />
          <Route
            path="liked-place"
            element={
              <PrivateRoute>
                <PageWrapper>
                  <FavouritePlaces />
                </PageWrapper>
              </PrivateRoute>
            }
          />
          <Route
            path="bookings"
            element={
              <PrivateRoute>
                <PageWrapper>
                  <BookingsPage />
                </PageWrapper>
              </PrivateRoute>
            }
          />
        </Route>
        {/*----------------------- Protected Routes -------------------*/}

        {/* ---------------------------------------------------- */}

        <Route
          path="*"
          element={
            <PageWrapper>
              <NotFoundPage />
            </PageWrapper>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
