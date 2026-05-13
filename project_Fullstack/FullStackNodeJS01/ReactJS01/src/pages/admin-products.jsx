import { useEffect, useMemo, useState } from "react";
import { Button, Image, Input, Modal, Select, Space, Table, notification } from "antd";
import AdminPageHeader from "../components/admin/AdminPageHeader";
import ProductFormModal from "../components/admin/ProductFormModal";
import StatusBadge from "../components/shared/StatusBadge";
import {
    createProductApi,
    deleteProductApi,
    getAdminCategoriesApi,
    getAdminProductsApi,
    updateProductApi
} from "../util/productApi";
import { formatCurrency } from "../util/format";

const normalizeProductPayload = (values) => ({
    ...values,
    price: Number(values.price),
    salePrice: values.salePrice === null || values.salePrice === undefined ? null : Number(values.salePrice),
    stock: Number(values.stock),
    sold: Number(values.sold),
    images: values.images
        ? values.images.split("\n").map((item) => item.trim()).filter(Boolean)
        : [],
    isNew: Boolean(values.isNew),
    isBestSeller: Boolean(values.isBestSeller),
    isSale: Boolean(values.isSale),
    isActive: Boolean(values.isActive)
});

const AdminProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [filters, setFilters] = useState({
        keyword: "",
        category: "",
        status: ""
    });

    const fetchCategories = async () => {
        const res = await getAdminCategoriesApi();
        setCategories(Array.isArray(res) ? res : []);
    };

    const fetchProducts = async () => {
        setLoading(true);
        const res = await getAdminProductsApi({
            keyword: filters.keyword || undefined,
            category: filters.category || undefined,
            status: filters.status || undefined
        });
        setProducts(Array.isArray(res) ? res : []);
        setLoading(false);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [filters]);

    const handleSubmit = async (values) => {
        setSubmitLoading(true);
        const payload = normalizeProductPayload(values);

        const res = editingProduct
            ? await updateProductApi(editingProduct._id, payload)
            : await createProductApi(payload);

        setSubmitLoading(false);

        if (res?.message && !res?._id) {
            notification.error({
                message: "Sản phẩm",
                description: res.message
            });
            return;
        }

        notification.success({
            message: "Sản phẩm",
            description: editingProduct ? "Cập nhật sản phẩm thành công" : "Tạo sản phẩm thành công"
        });
        setModalOpen(false);
        setEditingProduct(null);
        fetchProducts();
    };

    const handleDelete = (product) => {
        Modal.confirm({
            title: "Ngừng bán sản phẩm",
            content: `Bạn có chắc muốn ẩn sản phẩm "${product.name}"?`,
            okText: "Xác nhận",
            cancelText: "Hủy",
            onOk: async () => {
                const res = await deleteProductApi(product._id);
                if (res?.message === "Bạn không có quyền truy cập") {
                    notification.error({
                        message: "Quyền truy cập",
                        description: res.message
                    });
                    return;
                }
                notification.success({
                    message: "Sản phẩm",
                    description: "Đã chuyển sản phẩm sang trạng thái ngừng bán"
                });
                fetchProducts();
            }
        });
    };

    const columns = useMemo(() => ([
        {
            title: "Ảnh",
            dataIndex: "images",
            render: (images) => (
                <Image
                    src={images?.[0] || "https://picsum.photos/seed/admin-fallback/120/90"}
                    width={72}
                    height={56}
                    className="rounded-xl object-cover"
                    preview={false}
                />
            )
        },
        {
            title: "Tên sản phẩm",
            dataIndex: "name",
            render: (value, record) => (
                <div>
                    <p className="font-semibold text-slate-900">{value}</p>
                    <p className="text-xs text-slate-500">{record.slug}</p>
                </div>
            )
        },
        {
            title: "Danh mục",
            dataIndex: ["category", "name"]
        },
        {
            title: "Giá gốc",
            dataIndex: "price",
            render: (value) => formatCurrency(value)
        },
        {
            title: "Giá khuyến mãi",
            dataIndex: "salePrice",
            render: (value) => value ? formatCurrency(value) : "—"
        },
        {
            title: "Tồn kho",
            dataIndex: "stock"
        },
        {
            title: "Đã bán",
            dataIndex: "sold"
        },
        {
            title: "Trạng thái",
            render: (_, record) => (
                <Space wrap>
                    <StatusBadge tone={record.isActive ? "success" : "danger"}>
                        {record.isActive ? "Đang bán" : "Ngừng bán"}
                    </StatusBadge>
                    {record.isSale && <StatusBadge tone="warning">Khuyến mãi</StatusBadge>}
                    {record.isBestSeller && <StatusBadge tone="info">Bán chạy</StatusBadge>}
                </Space>
            )
        },
        {
            title: "Hành động",
            render: (_, record) => (
                <Space wrap>
                    <Button
                        className="!rounded-full !border-slate-300 !bg-white !text-slate-700 hover:!border-emerald-200 hover:!bg-emerald-50 hover:!text-emerald-700"
                        onClick={() => {
                            setEditingProduct(record);
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
                title="Quản lý sản phẩm"
                description="Theo dõi danh sách sản phẩm, thêm mới, cập nhật và ngừng bán khi cần."
                extra={(
                    <Button
                        type="primary"
                        className="!rounded-full !border-emerald-600 !bg-emerald-600 !px-5 !text-white hover:!border-emerald-700 hover:!bg-emerald-700"
                        onClick={() => {
                            setEditingProduct(null);
                            setModalOpen(true);
                        }}
                    >
                        Thêm sản phẩm
                    </Button>
                )}
            />

            <div className="grid gap-3 rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-3">
                <Input
                    placeholder="Tìm theo tên sản phẩm"
                    value={filters.keyword}
                    onChange={(e) => setFilters((prev) => ({ ...prev, keyword: e.target.value }))}
                />
                <Select
                    placeholder="Lọc theo danh mục"
                    allowClear
                    value={filters.category || undefined}
                    options={categories.map((item) => ({ label: item.name, value: item._id }))}
                    onChange={(value) => setFilters((prev) => ({ ...prev, category: value || "" }))}
                />
                <Select
                    placeholder="Lọc theo trạng thái"
                    allowClear
                    value={filters.status || undefined}
                    options={[
                        { label: "Đang bán", value: "active" },
                        { label: "Ngừng bán", value: "inactive" }
                    ]}
                    onChange={(value) => setFilters((prev) => ({ ...prev, status: value || "" }))}
                />
            </div>

            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm">
                <Table
                    rowKey="_id"
                    loading={loading}
                    columns={columns}
                    dataSource={products}
                    scroll={{ x: 1200 }}
                    pagination={{ pageSize: 6 }}
                />
            </div>

            <ProductFormModal
                open={modalOpen}
                onCancel={() => {
                    setModalOpen(false);
                    setEditingProduct(null);
                }}
                onSubmit={handleSubmit}
                initialValues={editingProduct}
                categories={categories}
                confirmLoading={submitLoading}
            />
        </div>
    );
};

export default AdminProductsPage;
