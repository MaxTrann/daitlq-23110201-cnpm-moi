import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConfigProvider } from 'antd'
import App from './App.jsx'
import './styles/global.css';

import {
    createBrowserRouter,
    Navigate,
    RouterProvider,
} from "react-router-dom";
import RegisterPage from './pages/register.jsx';
import HomePage from './pages/home.jsx';
import LoginPage from './pages/login.jsx';
import ForgotPasswordPage from './pages/forgot-password.jsx';
import UserProfilePage from './pages/user-profile.jsx';
import { AuthWrapper } from './components/context/auth.context.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import ProductListPage from './pages/product-list.jsx';
import ProductDetailPage from './pages/product-detail.jsx';
import AdminLayout from './components/admin/layout/AdminLayout.jsx';
import AdminDashboardPage from './pages/admin/dashboard.jsx';
import AdminProductsPage from './pages/admin-products.jsx';
import AdminCategoriesPage from './pages/admin-categories.jsx';
import AdminBrandsPage from './pages/admin/brands.jsx';
import AdminUsersPage from './pages/admin/users.jsx';
import AdminProfileInLayoutPage from './pages/admin/profile.jsx';
import AdminPlaceholder from './pages/admin/AdminPlaceholder.jsx';

const router = createBrowserRouter([
    {
        element: <ProtectedRoute />,
        children: [
            {
                path: "/",
                element: <App />,
                children: [
                    {
                        index: true,
                        element: <Navigate to="/home" replace />
                    },
                    {
                        path: "home",
                        element: <HomePage />
                    },
                    {
                        path: "products",
                        element: <ProductListPage />
                    },
                    {
                        path: "products/:id",
                        element: <ProductDetailPage />
                    },
                    {
                        path: "user/profile",
                        element: (
                            <ProtectedRoute allowedRoles={["User"]}>
                                <UserProfilePage />
                            </ProtectedRoute>
                        )
                    },
                ],
            },
            {
                path: "/admin",
                element: (
                    <ProtectedRoute allowedRoles={["Admin"]}>
                        <AdminLayout />
                    </ProtectedRoute>
                ),
                children: [
                    { index: true, element: <Navigate to="/admin/dashboard" replace /> },
                    { path: "dashboard", element: <AdminDashboardPage /> },
                    { path: "statistics", element: <AdminPlaceholder title="Thống kê chi tiết" /> },
                    { path: "products", element: <AdminProductsPage /> },
                    { path: "categories", element: <AdminCategoriesPage /> },
                    { path: "brands", element: <AdminBrandsPage /> },
                    { path: "coupons", element: <AdminPlaceholder title="Mã giảm giá" /> },
                    { path: "orders", element: <AdminPlaceholder title="Đơn hàng" /> },
                    { path: "reviews", element: <AdminPlaceholder title="Đánh giá sản phẩm" /> },
                    { path: "users", element: <AdminUsersPage /> },
                    { path: "roles", element: <AdminPlaceholder title="Vai trò & phân quyền" /> },
                    { path: "banners", element: <AdminPlaceholder title="Banner" /> },
                    { path: "pages", element: <AdminPlaceholder title="Trang nội dung" /> },
                    { path: "theme", element: <AdminPlaceholder title="Giao diện" /> },
                    { path: "profile", element: <AdminProfileInLayoutPage /> },
                ],
            },
        ],
    },
    {
        path: "register",
        element: <RegisterPage />
    },
    {
        path: "login",
        element: <LoginPage />
    },
    {
        path: "forgot-password",
        element: <ForgotPasswordPage />
    }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#0067b8',
                    borderRadius: 6,
                    fontFamily: '"Be Vietnam Pro", system-ui, sans-serif',
                },
            }}
        >
            <AuthWrapper>
                <RouterProvider router={router} />
            </AuthWrapper>
        </ConfigProvider>
    </React.StrictMode>,
)
