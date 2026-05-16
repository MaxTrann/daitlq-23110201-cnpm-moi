import { useContext } from "react";
import { Button, Form, Input, notification } from "antd";
import { loginApi, handleAuthError } from "../utils/api";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../components/context/auth.context";
import AuthShell from "../components/auth/AuthShell";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);

  const onFinish = async (values) => {
    const res = await loginApi(values.email, values.password);

    if (res?.EC === 0) {
      localStorage.setItem("access_token", res.access_token);
      notification.success({
        message: "Đăng nhập",
        description: res.EM ?? "Đăng nhập thành công",
      });
      setAuth({
        isAuthenticated: true,
        user: {
          id: res?.user?.id ?? "",
          email: res?.user?.email ?? "",
          name: res?.user?.name ?? "",
          role: res?.user?.role ?? "",
          phone: res?.user?.phone ?? "",
          address: res?.user?.address ?? "",
          avatar: res?.user?.avatar ?? "",
        },
      });
      navigate(res.redirectUrl || "/home");
      return;
    }

    if (res?.requiresVerification) {
      notification.warning({
        message: "Chưa kích hoạt",
        description: res.EM,
      });
      navigate("/register", { state: { email: res.email, step: 1 } });
      return;
    }

    notification.error({
      message: "Đăng nhập",
      description: handleAuthError(res),
    });
  };

  return (
    <AuthShell title="Đăng nhập" subtitle="Truy cập tài khoản MedCare của bạn">
      <Form name="login" onFinish={onFinish} autoComplete="off" layout="vertical" size="large">
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            { type: "email", message: "Email không hợp lệ" },
          ]}
        >
          <Input placeholder="email@example.com" />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
        >
          <Input.Password placeholder="••••••••" />
        </Form.Item>

        <div className="mb-4 text-right text-sm">
          <Link to="/forgot-password" className="text-[#0067b8] hover:underline">
            Quên mật khẩu?
          </Link>
        </div>

        <Form.Item className="mb-2">
          <Button type="primary" htmlType="submit" block>
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>

      <p className="mt-4 text-center text-sm text-[#666]">
        Chưa có tài khoản?{" "}
        <Link to="/register" className="font-semibold text-[#0067b8] hover:underline">
          Đăng ký ngay
        </Link>
      </p>
    </AuthShell>
  );
};

export default LoginPage;
