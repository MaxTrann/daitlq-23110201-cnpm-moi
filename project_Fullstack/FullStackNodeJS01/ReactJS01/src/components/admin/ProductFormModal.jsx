import { Form, Input, InputNumber, Modal, Select, Switch } from "antd";

const ProductFormModal = ({
    open,
    onCancel,
    onSubmit,
    initialValues,
    categories = [],
    confirmLoading
}) => {
    const [form] = Form.useForm();

    return (
        <Modal
            open={open}
            onCancel={() => {
                form.resetFields();
                onCancel();
            }}
            onOk={() => form.submit()}
            confirmLoading={confirmLoading}
            title={initialValues?._id ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
            okText={initialValues?._id ? "Lưu thay đổi" : "Tạo sản phẩm"}
            cancelText="Hủy"
            width={860}
            destroyOnHidden
            afterOpenChange={(visible) => {
                if (visible) {
                    form.setFieldsValue({
                        name: initialValues?.name || "",
                        slug: initialValues?.slug || "",
                        sku: initialValues?.sku || "",
                        shortDescription: initialValues?.shortDescription || "",
                        productType: initialValues?.productType || "medicine_otc",
                        activeIngredient: initialValues?.medicineDetail?.activeIngredient || "",
                        description: initialValues?.description || "",
                        price: initialValues?.price ?? 0,
                        salePrice: initialValues?.salePrice ?? null,
                        images: initialValues?.images?.join("\n") || "",
                        stock: initialValues?.stock ?? 0,
                        sold: initialValues?.sold ?? 0,
                        category: initialValues?.category?._id || initialValues?.category || undefined,
                        isNew: initialValues?.isNew ?? false,
                        isBestSeller: initialValues?.isBestSeller ?? false,
                        isSale: initialValues?.isSale ?? false,
                        isActive: initialValues?.isActive ?? true
                    });
                }
            }}
        >
            <Form form={form} layout="vertical" onFinish={onSubmit}>
                <div className="grid gap-4 md:grid-cols-2">
                    <Form.Item
                        label="Tên sản phẩm"
                        name="name"
                        rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
                    >
                        <Input placeholder="Ví dụ: Paracetamol 500mg" />
                    </Form.Item>
                    <Form.Item label="Slug" name="slug">
                        <Input placeholder="Để trống để tự sinh từ tên" />
                    </Form.Item>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Form.Item label="SKU" name="sku" rules={[{ required: true, message: "Nhập SKU" }]}>
                        <Input placeholder="MED-OTC-001" />
                    </Form.Item>
                    <Form.Item label="Loại" name="productType" rules={[{ required: true }]}>
                        <Select
                            options={[
                                { value: "medicine_otc", label: "Thuốc OTC" },
                                { value: "medicine_rx", label: "Thuốc kê đơn" },
                                { value: "functional_food", label: "TPCN" },
                                { value: "medical_device", label: "Thiết bị y tế" },
                            ]}
                        />
                    </Form.Item>
                </div>

                <Form.Item label="Mô tả ngắn" name="shortDescription">
                    <Input />
                </Form.Item>
                <Form.Item label="Hoạt chất" name="activeIngredient">
                    <Input />
                </Form.Item>

                <Form.Item label="Mô tả chi tiết" name="description">
                    <Input.TextArea rows={4} placeholder="Mô tả đầy đủ" />
                </Form.Item>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Form.Item
                        label="Giá gốc"
                        name="price"
                        rules={[{ required: true, message: "Giá gốc phải lớn hơn 0" }]}
                    >
                        <InputNumber className="!w-full" min={1} />
                    </Form.Item>
                    <Form.Item label="Giá khuyến mãi" name="salePrice">
                        <InputNumber className="!w-full" min={0} />
                    </Form.Item>
                    <Form.Item
                        label="Tồn kho"
                        name="stock"
                        rules={[{ required: true, message: "Vui lòng nhập tồn kho" }]}
                    >
                        <InputNumber className="!w-full" min={0} />
                    </Form.Item>
                    <Form.Item
                        label="Đã bán"
                        name="sold"
                        rules={[{ required: true, message: "Vui lòng nhập số lượng đã bán" }]}
                    >
                        <InputNumber className="!w-full" min={0} />
                    </Form.Item>
                </div>

                <Form.Item
                    label="Danh mục"
                    name="category"
                    rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
                >
                    <Select
                        placeholder="Chọn danh mục"
                        options={categories.map((item) => ({
                            label: item.name,
                            value: item._id
                        }))}
                    />
                </Form.Item>

                <Form.Item label="Danh sách ảnh" name="images">
                    <Input.TextArea rows={5} placeholder="Mỗi dòng là một URL ảnh" />
                </Form.Item>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Form.Item label="Sản phẩm mới" name="isNew" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                    <Form.Item label="Bán chạy" name="isBestSeller" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                    <Form.Item label="Khuyến mãi" name="isSale" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                    <Form.Item label="Đang bán" name="isActive" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                </div>
            </Form>
        </Modal>
    );
};

export default ProductFormModal;
