import { useContext } from "react";
import ProfileForm from "../../components/auth/ProfileForm";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import { AuthContext } from "../../components/context/auth.context";
import { getAdminProfileApi, updateAdminProfileApi } from "../../utils/api";

const AdminProfileInLayoutPage = () => {
  const { setAuth } = useContext(AuthContext);

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader title="Hồ sơ quản trị" description="Cập nhật thông tin tài khoản admin." />
      <div className="rounded-xl border border-[#e8e8e8] bg-white p-6">
        <ProfileForm
          title="Cập nhật hồ sơ"
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
      </div>
    </div>
  );
};

export default AdminProfileInLayoutPage;
