import React, { memo } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { LoadingSpinner } from "../components/Wrapper/PageWrapper";
import Navbar from "../components/Navbar/Navbar";
import { Layout, theme, Breadcrumb } from "antd";
import Sidebar from "../components/Dashboard/Sidebar";

const Dashboard = () => {
  const { loading: authLoading } = useSelector((state) => state.auth);
  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  if (authLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <Navbar />
      <Layout
        style={{
          minHeight: "100vh",
          marginTop: 100,
        }}
      >
        <Sidebar />
        <Layout className="bg-slate-100">
          <Breadcrumb
            style={{
              marginTop: "3%",
              marginBottom: "1%",
            }}
          >
            {window.location.pathname.split("/").map((path, index) => (
              <Breadcrumb.Item key={path + index}>{path}</Breadcrumb.Item>
            ))}
          </Breadcrumb>
          <div
            style={{
              padding: 24,
              minHeight: 360,

              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Layout>
      </Layout>
    </div>
  );
};

export default memo(Dashboard);
