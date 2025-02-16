import React, { memo, useState } from "react";
import { Layout, Menu, theme } from "antd";
import { sideBarItemsUser, sideBarItemsHost } from "./SideBarData";
const { Sider } = Layout;
import { useSelector } from "react-redux";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { user } = useSelector((state) => state.auth);
  const userRole = user?.role || "User";
  const menuItems = userRole === "Host" ? sideBarItemsHost : sideBarItemsUser;

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      style={{
        background: colorBgContainer,
      }}
    >
      <div className="demo-logo-vertical" />
      <Menu
        theme="light"
        defaultSelectedKeys={["1"]}
        mode="inline"
        items={menuItems}
      />
    </Sider>
  );
};

export default memo(Sidebar);
