import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css';

import {
    createBrowserRouter,
    Navigate,
    RouterProvider,
} from "react-router-dom";
import RegisterPage from './pages/register.jsx';
import UserPage from './pages/user.jsx';
import HomePage from './pages/home.jsx';
import LoginPage from './pages/login.jsx';
import { AuthWrapper } from './components/context/auth.context.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import ProductListPage from './pages/product-list.jsx';
import ProductDetailPage from './pages/product-detail.jsx';
import AdminProductsPage from './pages/admin-products.jsx';
import AdminCategoriesPage from './pages/admin-categories.jsx';

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
                        path: "user",
                        element: (
                            <ProtectedRoute allowedRoles={["Admin"]}>
                                <UserPage />
                            </ProtectedRoute>
                        )
                    },
                    {
                        path: "admin/products",
                        element: (
                            <ProtectedRoute allowedRoles={["Admin"]}>
                                <AdminProductsPage />
                            </ProtectedRoute>
                        )
                    },
                    {
                        path: "admin/categories",
                        element: (
                            <ProtectedRoute allowedRoles={["Admin"]}>
                                <AdminCategoriesPage />
                            </ProtectedRoute>
                        )
                    },
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
    }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthWrapper>
            <RouterProvider router={router} />
        </AuthWrapper>
    </React.StrictMode>,
)
