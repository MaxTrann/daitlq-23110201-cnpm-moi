import { notification, Table } from "antd";
import { useEffect, useState } from "react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import { getUserApi } from "../../utils/api";

const AdminUsersPage = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserApi()
      .then((res) => {
        if (Array.isArray(res)) {
          setDataSource(res);
        } else {
          notification.error({
            message: "Người dùng",
            description: res?.message ?? "Không thể tải danh sách",
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { title: "Email", dataIndex: "email" },
    { title: "Tên", dataIndex: "name" },
    { title: "Vai trò", dataIndex: "role" },
    { title: "SĐT", dataIndex: "phone", render: (v) => v || "—" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Quản lý người dùng"
        description="Danh sách tài khoản đã đăng ký trên hệ thống MedCare."
      />
      <div className="rounded-xl border border-[#e8e8e8] bg-white p-4">
        <Table bordered rowKey="_id" loading={loading} dataSource={dataSource} columns={columns} pagination={{ pageSize: 10 }} />
      </div>
    </div>
  );
};

export default AdminUsersPage;
