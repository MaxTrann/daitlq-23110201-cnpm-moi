import { Button, Divider, Form, Input, notification, Spin } from "antd";
import { useEffect, useState } from "react";
import { handleAuthError } from "../../utils/api";

const ProfileForm = ({ title, fetchProfile, updateProfile, onProfileUpdated }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      const res = await fetchProfile();
      if (res?.EC === 0 && res?.data) {
        form.setFieldsValue({
          name: res.data.name,
          email: res.data.email,
          phone: res.data.phone,
          address: res.data.address,
          avatar: res.data.avatar,
        });
      } else {
        notification.error({
          message: "Không thể tải hồ sơ",
          description: handleAuthError(res),
        });
      }
      setLoading(false);
    };

    loadProfile();
  }, [fetchProfile, form]);

  const onFinish = async (values) => {
    setSubmitting(true);
    const payload = {
      name: values.name,
      phone: values.phone,
      address: values.address,
      avatar: values.avatar,
    };

    if (values.newPassword) {
      payload.currentPassword = values.currentPassword;
      payload.newPassword = values.newPassword;
    }

    const res = await updateProfile(payload);
    if (res?.EC === 0) {
      notification.success({
        message: title,
        description: res.EM ?? "Cập nhật thành công",
      });
      onProfileUpdated?.(res.data);
      form.setFieldsValue({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } else {
      notification.error({
        message: title,
        description: handleAuthError(res),
      });
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spin tip="Đang tải hồ sơ..." />
      </div>
    );
  }

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} size="large" className="max-w-lg">
      <p className="mb-4 text-sm font-semibold text-[#004a85]">Thông tin liên hệ</p>

      <Form.Item label="Email" name="email">
        <Input disabled className="bg-[#f4f6f8]" />
      </Form.Item>

      <Form.Item
        label="Tên hiển thị"
        name="name"
        rules={[{ required: true, message: "Vui lòng nhập tên" }]}
      >
        <Input placeholder="Họ và tên" />
      </Form.Item>

      <Form.Item label="Số điện thoại" name="phone">
        <Input placeholder="09xxxxxxxx" />
      </Form.Item>

      <Form.Item label="Địa chỉ giao hàng" name="address">
        <Input.TextArea rows={3} placeholder="Số nhà, đường, quận, thành phố" />
      </Form.Item>

      <Form.Item label="Ảnh đại diện (URL)" name="avatar">
        <Input placeholder="https://..." />
      </Form.Item>

      <Divider className="!my-6" />

      <p className="mb-4 text-sm font-semibold text-[#004a85]">Đổi mật khẩu (tùy chọn)</p>
      <p className="mb-3 text-xs text-[#888]">Để trống nếu không đổi mật khẩu</p>

      <Form.Item label="Mật khẩu hiện tại" name="currentPassword">
        <Input.Password />
      </Form.Item>

      <Form.Item
        label="Mật khẩu mới"
        name="newPassword"
        rules={[
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value && !getFieldValue("currentPassword")) {
                return Promise.resolve();
              }
              if (value && value.length >= 8) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("Mật khẩu mới tối thiểu 8 ký tự"));
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        label="Xác nhận mật khẩu mới"
        name="confirmPassword"
        dependencies={["newPassword"]}
        rules={[
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!getFieldValue("newPassword")) {
                return Promise.resolve();
              }
              if (value === getFieldValue("newPassword")) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("Mật khẩu xác nhận không khớp"));
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item className="mb-0">
        <Button type="primary" htmlType="submit" loading={submitting} className="min-w-[160px]">
          Lưu thay đổi
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ProfileForm;
