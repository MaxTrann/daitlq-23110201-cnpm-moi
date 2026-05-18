import { useMemo } from "react";
import { Form, Input, InputNumber, Modal, Select, Switch } from "antd";
import {
    PRODUCT_UNIT_OPTIONS,
    buildPackagingOptions,
    buildProductUnitOptions,
} from "../../constants/productUnits";
import RichTextEditor from "./RichTextEditor";

const ProductFormModal = ({
    open,
    onCancel,
    onSubmit,
    initialValues,
    categories = [],
    confirmLoading
}) => {
    const [form] = Form.useForm();
    const unitLabel = Form.useWatch("unitLabel", form);
    const packagingDescription = Form.useWatch("packagingDescription", form);

    const unitOptions = useMemo(
        () => buildProductUnitOptions(initialValues?.unitLabel),
        [initialValues?.unitLabel]
    );

    const packagingOptions = useMemo(
        () =>
            buildPackagingOptions(
                unitLabel || initialValues?.unitLabel,
                packagingDescription || initialValues?.packagingDescription
            ),
        [unitLabel, packagingDescription, initialValues?.unitLabel, initialValues?.packagingDescription]
    );

    const defaultFormValues = useMemo(
        () => ({
            name: "",
            slug: "",
            sku: "",
            shortDescription: "",
            productType: "medicine_otc",
            activeIngredient: "",
            description: "",
            price: 0,
            salePrice: null,
            images: "",
            stock: 0,
            sold: 0,
            category: undefined,
            isNew: false,
            isBestSeller: false,
            isSale: false,
            isActive: true,
            requiresPharmacistAdvice: false,
            unitLabel: "Hộp",
            packagingDescription: undefined,
        }),
        []
    );

    const mapProductToForm = (product) => ({
        name: product?.name || "",
        slug: product?.slug || "",
        sku: product?.sku || "",
        shortDescription: product?.shortDescription || "",
        productType: product?.productType || "medicine_otc",
        activeIngredient: product?.medicineDetail?.activeIngredient || "",
        description: product?.description || "",
        price: product?.price ?? 0,
        salePrice: product?.salePrice ?? null,
        images: product?.images?.join("\n") || "",
        stock: product?.stock ?? 0,
        sold: product?.sold ?? 0,
        category: product?.category?._id || product?.category || undefined,
        isNew: product?.isNew ?? false,
        isBestSeller: product?.isBestSeller ?? false,
        isSale: product?.isSale ?? false,
        isActive: product?.isActive ?? true,
        requiresPharmacistAdvice: product?.requiresPharmacistAdvice ?? false,
        unitLabel: product?.unitLabel || "Hộp",
        packagingDescription: product?.packagingDescription || undefined,
    });

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
            width={960}
            destroyOnClose
            afterOpenChange={(visible) => {
                if (visible) {
                    form.setFieldsValue(
                        initialValues?._id ? mapProductToForm(initialValues) : defaultFormValues
                    );
                } else {
                    form.resetFields();
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

                <div className="grid gap-4 md:grid-cols-2">
                    <Form.Item
                        label="Đơn vị bán"
                        name="unitLabel"
                        rules={[{ required: true, message: "Vui lòng chọn đơn vị" }]}
                        tooltip="Hiển thị dưới tên sản phẩm trên danh sách cửa hàng"
                    >
                        <Select
                            placeholder="Chọn đơn vị"
                            options={unitOptions.length ? unitOptions : PRODUCT_UNIT_OPTIONS}
                            showSearch
                            optionFilterProp="label"
                            onChange={() => form.setFieldValue("packagingDescription", undefined)}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Quy cách đóng gói"
                        name="packagingDescription"
                        tooltip="Hiển thị tại mục Quy cách trên trang chi tiết sản phẩm"
                    >
                        <Select
                            allowClear
                            placeholder={unitLabel ? `Chọn quy cách (${unitLabel})` : "Chọn quy cách đóng gói"}
                            options={packagingOptions}
                            showSearch
                            optionFilterProp="label"
                            disabled={!unitLabel}
                        />
                    </Form.Item>
                </div>
                <Form.Item label="Hoạt chất" name="activeIngredient">
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Mô tả sản phẩm"
                    name="description"
                    tooltip="Soạn thảo như Word — in đậm, danh sách, bảng, chèn ảnh (hiển thị ở section Mô tả sản phẩm)"
                    getValueFromEvent={(value) => value}
                >
                    <RichTextEditor key={initialValues?._id || "new-product"} />
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

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
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
                    <Form.Item
                        label="Cần tư vấn dược sĩ"
                        name="requiresPharmacistAdvice"
                        valuePropName="checked"
                        tooltip="Hiển thị nhãn trên thẻ sản phẩm, khách nên liên hệ dược sĩ trước khi mua"
                    >
                        <Switch />
                    </Form.Item>
                </div>
            </Form>
        </Modal>
    );
};

export default ProductFormModal;
