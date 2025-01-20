import React, { lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute.jsx";
import paymentsuccess from "./assets/check02_gifAnthony Fessy.gif";

// Lazy load all pages and components
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
const ConfirmAndPay = lazy(() => import("./pages/ConfirmAndPay.jsx"));
const BookingRequest = lazy(() =>
  import("./components/common/BookingRequest.jsx")
);
const FavouritePlaces = lazy(() => import("./pages/FavouritePlaces.jsx"));

// Loading fallback component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const pageTransition = {
  initial: { opacity: 0, x: -100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 100 },
};

const PageWrapper = ({ children }) => (
  <motion.div
    initial={pageTransition.initial}
    animate={pageTransition.animate}
    exit={pageTransition.exit}
    transition={{ duration: 0.5 }}
  >
    <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
  </motion.div>
);

function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              <PageWrapper>
                <HomePage />
              </PageWrapper>
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
            path="/place/:id"
            element={
              <PageWrapper>
                <PlaceDetail />
              </PageWrapper>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/account"
            element={
              <PrivateRoute>
                <PageWrapper>
                  <ProfilePage />
                </PageWrapper>
              </PrivateRoute>
            }
          />
          <Route
            path="/account/liked-place"
            element={
              <PrivateRoute>
                <PageWrapper>
                  <FavouritePlaces />
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
            path="/account/notification"
            element={
              <PrivateRoute>
                <PageWrapper>
                  <Notification />
                </PageWrapper>
              </PrivateRoute>
            }
          />
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
            path="/account/places/:id"
            element={
              <PrivateRoute>
                <PageWrapper>
                  <HostPlacesFormPage />
                </PageWrapper>
              </PrivateRoute>
            }
          />
          <Route
            path="/account/bookings"
            element={
              <PrivateRoute>
                <PageWrapper>
                  <BookingsPage />
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
                  <img
                    src={paymentsuccess}
                    alt="success"
                    className="w-full justify-center"
                  />
                </PageWrapper>
              </PrivateRoute>
            }
          />
          <Route
            path="*"
            element={
              <PageWrapper>
                <NotFoundPage />
              </PageWrapper>
            }
          />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default App;
