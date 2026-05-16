import { useContext } from "react";
import AccountShell from "../components/auth/AccountShell";
import ProfileForm from "../components/auth/ProfileForm";
import { AuthContext } from "../components/context/auth.context";
import { getAdminProfileApi, updateAdminProfileApi } from "../utils/api";

const AdminProfilePage = () => {
  const { setAuth } = useContext(AuthContext);

  return (
    <AccountShell
      title="Hồ sơ quản trị"
      description="Thông tin tài khoản quản trị viên MedCare"
      role="Admin"
    >
      <ProfileForm
        title="Cập nhật hồ sơ admin"
        fetchProfile={getAdminProfileApi}
        updateProfile={updateAdminProfileApi}
        onProfileUpdated={(user) => {
          setAuth({
            isAuthenticated: true,
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
              phone: user.phone,
              address: user.address,
              avatar: user.avatar,
            },
          });
        }}
      />
    </AccountShell>
  );
};

export default AdminProfilePage;
