import { Form, Input, Modal, Switch } from "antd";

const CategoryFormModal = ({ open, onCancel, onSubmit, initialValues, confirmLoading }) => {
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
            title={initialValues?._id ? "Cập nhật danh mục" : "Thêm danh mục"}
            okText={initialValues?._id ? "Lưu thay đổi" : "Tạo danh mục"}
            cancelText="Hủy"
            destroyOnHidden
            afterOpenChange={(visible) => {
                if (visible) {
                    form.setFieldsValue({
                        name: initialValues?.name || "",
                        slug: initialValues?.slug || "",
                        description: initialValues?.description || "",
                        isActive: initialValues?.isActive ?? true
                    });
                }
            }}
        >
            <Form form={form} layout="vertical" onFinish={onSubmit}>
                <Form.Item
                    label="Tên danh mục"
                    name="name"
                    rules={[{ required: true, message: "Vui lòng nhập tên danh mục" }]}
                >
                    <Input placeholder="Ví dụ: Giày sneaker" />
                </Form.Item>
                <Form.Item label="Slug" name="slug">
                    <Input placeholder="Để trống để tự sinh từ tên" />
                </Form.Item>
                <Form.Item label="Mô tả" name="description">
                    <Input.TextArea rows={4} placeholder="Mô tả ngắn cho danh mục" />
                </Form.Item>
                <Form.Item label="Đang hiển thị" name="isActive" valuePropName="checked">
                    <Switch checkedChildren="Đang bán" unCheckedChildren="Ẩn" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CategoryFormModal;
