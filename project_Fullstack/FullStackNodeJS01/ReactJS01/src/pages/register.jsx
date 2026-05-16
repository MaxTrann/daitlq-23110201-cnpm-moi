import { useEffect, useState } from "react";
import { Button, Form, Input, notification, Steps } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthShell from "../components/auth/AuthShell";
import { handleAuthError, registerApi, resendRegisterOtpApi, verifyRegisterOtpApi } from "../utils/api";

const passwordPatternRules = [
  { required: true, message: "Vui lòng nhập mật khẩu!" },
  { min: 8, message: "Mật khẩu tối thiểu 8 ký tự" },
  {
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
    message: "Mật khẩu cần có chữ hoa, chữ thường và số",
  },
];

const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
    if (location.state?.step === 1) {
      setStep(1);
    }
  }, [location.state]);

  const onRegister = async (values) => {
    setSubmitting(true);
    const res = await registerApi(values.name, values.email, values.password);
    if (res?.EC === 0) {
      setEmail(values.email);
      setStep(1);
      notification.success({
        message: "Đăng ký",
        description: res.EM,
      });
    } else {
      notification.error({
        message: "Đăng ký",
        description: handleAuthError(res),
      });
    }
    setSubmitting(false);
  };

  const onVerifyOtp = async (values) => {
    setSubmitting(true);
    const res = await verifyRegisterOtpApi(email, values.otp);
    if (res?.EC === 0) {
      notification.success({
        message: "Kích hoạt tài khoản",
        description: res.EM,
      });
      navigate("/login");
    } else {
      notification.error({
        message: "Xác thực OTP",
        description: handleAuthError(res),
      });
    }
    setSubmitting(false);
  };

  const handleResendOtp = async () => {
    const res = await resendRegisterOtpApi(email);
    if (res?.EC === 0) {
      notification.success({ message: "OTP", description: res.EM });
    } else {
      notification.error({ message: "OTP", description: handleAuthError(res) });
    }
  };

  return (
    <AuthShell
      size="wide"
      title="Đăng ký tài khoản"
      subtitle="Tạo tài khoản MedCare để mua thuốc OTC, TPCN và thiết bị y tế"
    >
      <Steps
        current={step}
        items={[{ title: "Thông tin" }, { title: "Xác thực OTP" }]}
        className="mb-6"
      />

      {step === 0 ? (
        <Form layout="vertical" onFinish={onRegister} size="large">
          <Form.Item label="Tên hiển thị" name="name" rules={[{ required: true, message: "Vui lòng nhập tên" }]}>
            <Input placeholder="Nguyễn Văn A" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input placeholder="email@example.com" />
          </Form.Item>
          <Form.Item label="Mật khẩu" name="password" rules={passwordPatternRules}>
            <Input.Password placeholder="Tối thiểu 8 ký tự" />
          </Form.Item>
          <Form.Item
            label="Xác nhận mật khẩu"
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Mật khẩu xác nhận không khớp"));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={submitting} block>
              Đăng ký & nhận OTP
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <Form layout="vertical" onFinish={onVerifyOtp} size="large">
          <p className="mb-4 rounded-md bg-[#e8f4fc] px-3 py-2 text-sm text-[#004a85]">
            Mã OTP đã gửi tới <strong>{email}</strong>. Kiểm tra hộp thư (hoặc console backend nếu chưa cấu hình SMTP).
          </p>
          <Form.Item
            label="Mã OTP (6 số)"
            name="otp"
            rules={[
              { required: true, message: "Vui lòng nhập OTP" },
              { len: 6, message: "OTP phải có 6 chữ số" },
              { pattern: /^\d+$/, message: "OTP chỉ gồm số" },
            ]}
          >
            <Input maxLength={6} placeholder="000000" className="tracking-widest" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={submitting} block>
              Kích hoạt tài khoản
            </Button>
          </Form.Item>
          <div className="flex flex-wrap justify-center gap-2">
            <Button onClick={handleResendOtp}>Gửi lại OTP</Button>
            <Button type="link" onClick={() => setStep(0)}>
              Quay lại
            </Button>
          </div>
        </Form>
      )}

      <p className="mt-4 text-center text-sm text-[#666]">
        Đã có tài khoản?{" "}
        <Link to="/login" className="font-semibold text-[#0067b8] hover:underline">
          Đăng nhập
        </Link>
      </p>
    </AuthShell>
  );
};

export default RegisterPage;
