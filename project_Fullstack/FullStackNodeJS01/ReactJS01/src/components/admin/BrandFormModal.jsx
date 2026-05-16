import { Form, Input, Modal, Switch } from "antd";
import { useEffect } from "react";

const BrandFormModal = ({ open, onCancel, onSubmit, initialValues, confirmLoading }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        name: initialValues?.name ?? "",
        slug: initialValues?.slug ?? "",
        country: initialValues?.country ?? "",
        logo: initialValues?.logo ?? "",
        isActive: initialValues?.isActive !== false,
      });
    } else {
      form.resetFields();
    }
  }, [open, initialValues, form]);

  return (
    <Modal
      title={initialValues?._id ? "Cập nhật thương hiệu" : "Thêm thương hiệu"}
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
      confirmLoading={confirmLoading}
      okText="Lưu"
      cancelText="Hủy"
      destroyOnHidden
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item label="Tên thương hiệu" name="name" rules={[{ required: true, message: "Nhập tên" }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Slug (tùy chọn)" name="slug">
          <Input placeholder="tu-dong-tao-neu-de-trong" />
        </Form.Item>
        <Form.Item label="Quốc gia" name="country">
          <Input />
        </Form.Item>
        <Form.Item label="Logo (URL)" name="logo">
          <Input placeholder="https://..." />
        </Form.Item>
        <Form.Item label="Đang hoạt động" name="isActive" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BrandFormModal;
