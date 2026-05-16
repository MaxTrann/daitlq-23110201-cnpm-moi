import { useContext, useMemo, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Layout, Menu, Avatar, Dropdown, Button, theme } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  HomeOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { AuthContext } from "../../context/auth.context";
import { adminMenuSections } from "./adminMenu";

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { auth, setAuth } = useContext(AuthContext);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const menuItems = useMemo(() => {
    const items = [];
    adminMenuSections.forEach((section) => {
      if (section.label) {
        items.push({ type: "group", label: section.label, key: section.key });
      }
      section.items.forEach((item) => {
        items.push({
          key: item.key,
          icon: item.icon,
          label: item.disabled ? (
            <span className="text-[#999]">{item.label}</span>
          ) : (
            item.label
          ),
          disabled: item.disabled,
        });
      });
    });
    return items;
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setAuth({
      isAuthenticated: false,
      user: { id: "", email: "", name: "", role: "" },
    });
    navigate("/login");
  };

  const userMenu = {
    items: [
      {
        key: "profile",
        icon: <UserOutlined />,
        label: "Hồ sơ quản trị",
        onClick: () => navigate("/admin/profile"),
      },
      {
        key: "shop",
        icon: <HomeOutlined />,
        label: "Về cửa hàng",
        onClick: () => navigate("/home"),
      },
      { type: "divider" },
      {
        key: "logout",
        icon: <LogoutOutlined />,
        label: "Đăng xuất",
        onClick: handleLogout,
      },
    ],
  };

  return (
    <Layout className="min-h-screen">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={240}
        className="!bg-[#001529]"
        style={{ position: "sticky", top: 0, height: "100vh", overflow: "auto" }}
      >
        <div className="flex h-16 items-center justify-center border-b border-white/10 px-3">
          <Link to="/admin/dashboard" className="text-lg font-bold text-white">
            {collapsed ? "MC" : "MedCare Admin"}
          </Link>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => {
            if (!key.startsWith("/admin")) return;
            const item = adminMenuSections.flatMap((s) => s.items).find((i) => i.key === key);
            if (item?.disabled) return;
            navigate(key);
          }}
          style={{ borderInlineEnd: 0 }}
        />
      </Sider>

      <Layout>
        <Header
          style={{ background: colorBgContainer, padding: "0 24px" }}
          className="flex items-center justify-between border-b border-[#f0f0f0] shadow-sm"
        >
          <div className="flex items-center gap-4">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
            />
            <div>
              <p className="m-0 text-base font-semibold text-[#333]">
                Xin chào, {auth?.user?.name || "admin"}
              </p>
              <p className="m-0 text-xs text-[#888]">Tổng quan hiệu suất cửa hàng</p>
            </div>
          </div>
          <Dropdown menu={userMenu} placement="bottomRight">
            <button type="button" className="flex cursor-pointer items-center gap-2 border-0 bg-transparent">
              <Avatar style={{ backgroundColor: "#0067b8" }}>
                {(auth?.user?.name || "A").charAt(0).toUpperCase()}
              </Avatar>
            </button>
          </Dropdown>
        </Header>

        <Content className="m-4 min-h-[calc(100vh-120px)] rounded-lg bg-[#f5f6f8] p-4 md:p-6">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
