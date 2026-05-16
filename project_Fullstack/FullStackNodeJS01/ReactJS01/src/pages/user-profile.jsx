import { useContext } from "react";
import AccountShell from "../components/auth/AccountShell";
import ProfileForm from "../components/auth/ProfileForm";
import { AuthContext } from "../components/context/auth.context";
import { getUserProfileApi, updateUserProfileApi } from "../utils/api";

const UserProfilePage = () => {
  const { setAuth } = useContext(AuthContext);

  return (
    <AccountShell
      title="Hồ sơ cá nhân"
      description="Quản lý thông tin tài khoản và địa chỉ giao hàng"
      role="User"
    >
      <ProfileForm
        title="Cập nhật hồ sơ"
        fetchProfile={getUserProfileApi}
        updateProfile={updateUserProfileApi}
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

export default UserProfilePage;
