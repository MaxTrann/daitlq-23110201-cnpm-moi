import {
  AppstoreOutlined,
  BarChartOutlined,
  FileTextOutlined,
  GiftOutlined,
  LayoutOutlined,
  MedicineBoxOutlined,
  PictureOutlined,
  ShoppingCartOutlined,
  StarOutlined,
  TagsOutlined,
  TeamOutlined,
  TrophyOutlined,
  UserOutlined,
} from "@ant-design/icons";

export const adminMenuSections = [
  {
    key: "main",
    items: [
      { key: "/admin/dashboard", icon: <AppstoreOutlined />, label: "Dashboard" },
      { key: "/admin/statistics", icon: <BarChartOutlined />, label: "Thống kê" },
    ],
  },
  {
    key: "management",
    label: "QUẢN LÝ",
    items: [
      { key: "/admin/products", icon: <MedicineBoxOutlined />, label: "Sản phẩm" },
      { key: "/admin/categories", icon: <TagsOutlined />, label: "Danh mục" },
      { key: "/admin/brands", icon: <TrophyOutlined />, label: "Thương hiệu" },
      { key: "/admin/coupons", icon: <GiftOutlined />, label: "Mã giảm giá", disabled: true },
      { key: "/admin/orders", icon: <ShoppingCartOutlined />, label: "Đơn hàng", disabled: true },
      { key: "/admin/reviews", icon: <StarOutlined />, label: "Đánh giá", disabled: true },
      { key: "/admin/users", icon: <TeamOutlined />, label: "Người dùng" },
      { key: "/admin/roles", icon: <UserOutlined />, label: "Vai trò", disabled: true },
    ],
  },
  {
    key: "content",
    label: "NỘI DUNG & GIAO DIỆN",
    items: [
      { key: "/admin/banners", icon: <PictureOutlined />, label: "Banner", disabled: true },
      { key: "/admin/pages", icon: <FileTextOutlined />, label: "Trang nội dung", disabled: true },
      { key: "/admin/theme", icon: <LayoutOutlined />, label: "Giao diện", disabled: true },
    ],
  },
];
