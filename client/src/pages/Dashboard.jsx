import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/Dashboard/Sidebar";
import { LoadingSpinner } from "../components/Wrapper/PageWrapper";
import Navbar from "../components/Navbar/Navbar";

function Dashboard() {
  //   const { loading: profileLoading } = useSelector((state) => state.profile);
  const { loading: authLoading } = useSelector((state) => state.auth);

  if (authLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <Navbar />
      <div className=" relative top-[80px] flex min-h-[calc(100vh-3.5rem)]">
        <Sidebar />
        <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
          <div className="mx-auto w-11/12 max-w-[1000px] py-10">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
