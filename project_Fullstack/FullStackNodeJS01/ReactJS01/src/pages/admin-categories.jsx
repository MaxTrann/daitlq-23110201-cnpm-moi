import { useEffect, useMemo, useState } from "react";
import { Button, Input, Modal, Select, Space, Table, notification } from "antd";
import AdminPageHeader from "../components/admin/AdminPageHeader";
import CategoryFormModal from "../components/admin/CategoryFormModal";
import StatusBadge from "../components/shared/StatusBadge";
import {
    createCategoryApi,
    deleteCategoryApi,
    getAdminCategoriesApi,
    updateCategoryApi
} from "../util/productApi";

const AdminCategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [filters, setFilters] = useState({
        keyword: "",
        status: ""
    });

    const fetchCategories = async () => {
        setLoading(true);
        const res = await getAdminCategoriesApi({
            keyword: filters.keyword || undefined,
            status: filters.status || undefined
        });
        setCategories(Array.isArray(res) ? res : []);
        setLoading(false);
    };

    useEffect(() => {
        fetchCategories();
    }, [filters]);

    const handleSubmit = async (values) => {
        setSubmitLoading(true);
        const res = editingCategory
            ? await updateCategoryApi(editingCategory._id, values)
            : await createCategoryApi(values);

        setSubmitLoading(false);

        if (res?.message && !res?._id) {
            notification.error({
                message: "Danh mục",
                description: res.message
            });
            return;
        }

        notification.success({
            message: "Danh mục",
            description: editingCategory ? "Cập nhật danh mục thành công" : "Tạo danh mục thành công"
        });
        setModalOpen(false);
        setEditingCategory(null);
        fetchCategories();
    };

    const handleDelete = (category) => {
        Modal.confirm({
            title: "Ẩn danh mục",
            content: `Bạn có chắc muốn ẩn danh mục "${category.name}"?`,
            okText: "Xác nhận",
            cancelText: "Hủy",
            onOk: async () => {
                const res = await deleteCategoryApi(category._id);
                if (res?.message === "Bạn không có quyền truy cập") {
                    notification.error({
                        message: "Quyền truy cập",
                        description: res.message
                    });
                    return;
                }
                notification.success({
                    message: "Danh mục",
                    description: "Đã ẩn danh mục"
                });
                fetchCategories();
            }
        });
    };

    const columns = useMemo(() => ([
        {
            title: "Tên danh mục",
            dataIndex: "name",
            render: (value, record) => (
                <div>
                    <p className="font-semibold text-slate-900">{value}</p>
                    <p className="text-xs text-slate-500">{record.slug}</p>
                </div>
            )
        },
        {
            title: "Mô tả",
            dataIndex: "description",
            render: (value) => <p className="line-clamp-2 text-sm text-slate-500">{value || "—"}</p>
        },
        {
            title: "Trạng thái",
            dataIndex: "isActive",
            render: (value) => (
                <StatusBadge tone={value ? "success" : "danger"}>
                    {value ? "Đang dùng" : "Đã ẩn"}
                </StatusBadge>
            )
        },
        {
            title: "Hành động",
            render: (_, record) => (
                <Space wrap>
                    <Button
                        className="!rounded-full !border-slate-300 !bg-white !text-slate-700 hover:!border-emerald-200 hover:!bg-emerald-50 hover:!text-emerald-700"
                        onClick={() => {
                            setEditingCategory(record);
                            setModalOpen(true);
                        }}
                    >
                        Sửa
                    </Button>
                    <Button className="!rounded-full !border-red-500 !bg-red-500 !text-white hover:!border-red-600 hover:!bg-red-600" danger onClick={() => handleDelete(record)}>
                        Ẩn
                    </Button>
                </Space>
            )
        }
    ]), []);

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 md:px-6 lg:px-8">
            <AdminPageHeader
                title="Quản lý danh mục"
                description="Tạo, chỉnh sửa và ẩn danh mục để dữ liệu storefront luôn đồng bộ."
                extra={(
                    <Button
                        type="primary"
                        className="!rounded-full !border-emerald-600 !bg-emerald-600 !px-5 !text-white hover:!border-emerald-700 hover:!bg-emerald-700"
                        onClick={() => {
                            setEditingCategory(null);
                            setModalOpen(true);
                        }}
                    >
                        Thêm danh mục
                    </Button>
                )}
            />

            <div className="grid gap-3 rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-2">
                <Input
                    placeholder="Tìm theo tên danh mục"
                    value={filters.keyword}
                    onChange={(e) => setFilters((prev) => ({ ...prev, keyword: e.target.value }))}
                />
                <Select
                    placeholder="Lọc theo trạng thái"
                    allowClear
                    value={filters.status || undefined}
                    options={[
                        { label: "Đang dùng", value: "active" },
                        { label: "Đã ẩn", value: "inactive" }
                    ]}
                    onChange={(value) => setFilters((prev) => ({ ...prev, status: value || "" }))}
                />
            </div>

            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm">
                <Table
                    rowKey="_id"
                    loading={loading}
                    columns={columns}
                    dataSource={categories}
                    pagination={{ pageSize: 8 }}
                />
            </div>

            <CategoryFormModal
                open={modalOpen}
                onCancel={() => {
                    setModalOpen(false);
                    setEditingCategory(null);
                }}
                onSubmit={handleSubmit}
                initialValues={editingCategory}
                confirmLoading={submitLoading}
            />
        </div>
    );
};

export default AdminCategoriesPage;
