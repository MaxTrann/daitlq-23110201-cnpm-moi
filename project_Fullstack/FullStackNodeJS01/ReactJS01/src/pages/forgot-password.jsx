import { useState } from "react";
import { Button, Form, Input, Steps, notification } from "antd";
import { Link, useNavigate } from "react-router-dom";
import AuthShell from "../components/auth/AuthShell";
import {
  forgotPasswordApi,
  verifyResetOtpApi,
  resetPasswordApi,
  handleAuthError,
} from "../utils/api";

const passwordRules = [
  { required: true, message: "Vui lòng nhập mật khẩu mới" },
  { min: 8, message: "Mật khẩu tối thiểu 8 ký tự" },
  {
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
    message: "Mật khẩu cần có chữ hoa, chữ thường và số",
  },
];

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [loading, setLoading] = useState(false);

  const onSendOtp = async (values) => {
    setLoading(true);
    const res = await forgotPasswordApi(values.email);
    if (res?.EC === 0) {
      setEmail(values.email);
      setStep(1);
      notification.success({ message: "OTP", description: res.EM });
    } else {
      notification.error({ message: "Lỗi", description: handleAuthError(res) });
    }
    setLoading(false);
  };

  const onVerifyOtp = async (values) => {
    setLoading(true);
    const res = await verifyResetOtpApi(email, values.otp);
    if (res?.EC === 0 && res.resetToken) {
      setResetToken(res.resetToken);
      setStep(2);
      notification.success({ message: "OTP", description: res.EM });
    } else {
      notification.error({ message: "OTP", description: handleAuthError(res) });
    }
    setLoading(false);
  };

  const onResetPassword = async (values) => {
    setLoading(true);
    const res = await resetPasswordApi(resetToken, values.newPassword);
    if (res?.EC === 0) {
      notification.success({ message: "Thành công", description: res.EM });
      navigate("/login");
    } else {
      notification.error({ message: "Lỗi", description: handleAuthError(res) });
    }
    setLoading(false);
  };

  return (
    <AuthShell
      size="wide"
      title="Quên mật khẩu"
      subtitle="Khôi phục mật khẩu qua email đã đăng ký"
    >
      <Steps
        current={step}
        items={[{ title: "Email" }, { title: "OTP" }, { title: "Mật khẩu mới" }]}
        className="mb-6"
      />

      {step === 0 && (
        <Form layout="vertical" onFinish={onSendOtp} size="large">
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input placeholder="email@example.com" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Gửi OTP
            </Button>
          </Form.Item>
        </Form>
      )}

      {step === 1 && (
        <Form layout="vertical" onFinish={onVerifyOtp} size="large">
          <p className="mb-4 rounded-md bg-[#e8f4fc] px-3 py-2 text-sm text-[#004a85]">
            OTP đã gửi tới <strong>{email}</strong>
          </p>
          <Form.Item
            label="Mã OTP"
            name="otp"
            rules={[
              { required: true, message: "Nhập OTP" },
              { len: 6, message: "OTP 6 chữ số" },
            ]}
          >
            <Input maxLength={6} placeholder="000000" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Xác thực OTP
            </Button>
          </Form.Item>
        </Form>
      )}

      {step === 2 && (
        <Form layout="vertical" onFinish={onResetPassword} size="large">
          <Form.Item label="Mật khẩu mới" name="newPassword" rules={passwordRules}>
            <Input.Password placeholder="Mật khẩu mới" />
          </Form.Item>
          <Form.Item
            label="Xác nhận mật khẩu"
            name="confirmPassword"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Xác nhận mật khẩu" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Mật khẩu không khớp"));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Đặt lại mật khẩu
            </Button>
          </Form.Item>
        </Form>
      )}

      <p className="mt-4 text-center text-sm text-[#666]">
        <Link to="/login" className="font-semibold text-[#0067b8] hover:underline">
          ← Quay lại đăng nhập
        </Link>
      </p>
    </AuthShell>
  );
};

export default ForgotPasswordPage;
