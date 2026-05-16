import { useEffect, useMemo, useState } from "react";
import { Button, Input, Select, Space, Table, notification } from "antd";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import BrandFormModal from "../../components/admin/BrandFormModal";
import StatusBadge from "../../components/shared/StatusBadge";
import { createBrandApi, getAdminBrandsApi, updateBrandApi } from "../../utils/adminApi";

const AdminBrandsPage = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [filters, setFilters] = useState({ keyword: "", status: "" });

  const fetchBrands = async () => {
    setLoading(true);
    const res = await getAdminBrandsApi({
      keyword: filters.keyword || undefined,
      status: filters.status || undefined,
    });
    setBrands(Array.isArray(res) ? res : []);
    setLoading(false);
  };

  useEffect(() => {
    fetchBrands();
  }, [filters]);

  const handleSubmit = async (values) => {
    setSubmitLoading(true);
    const res = editing ? await updateBrandApi(editing._id, values) : await createBrandApi(values);
    setSubmitLoading(false);

    if (res?.message && !res?._id && !res?.name) {
      notification.error({ message: "Thương hiệu", description: res.message });
      return;
    }

    notification.success({
      message: "Thương hiệu",
      description: editing ? "Cập nhật thành công" : "Tạo mới thành công",
    });
    setModalOpen(false);
    setEditing(null);
    fetchBrands();
  };

  const columns = useMemo(
    () => [
      {
        title: "Thương hiệu",
        dataIndex: "name",
        render: (value, record) => (
          <div>
            <p className="m-0 font-semibold">{value}</p>
            <p className="m-0 text-xs text-[#888]">{record.slug}</p>
          </div>
        ),
      },
      { title: "Quốc gia", dataIndex: "country", render: (v) => v || "—" },
      {
        title: "Trạng thái",
        dataIndex: "isActive",
        render: (v) => <StatusBadge tone={v ? "success" : "danger"}>{v ? "Hoạt động" : "Ẩn"}</StatusBadge>,
      },
      {
        title: "Hành động",
        render: (_, record) => (
          <Button
            onClick={() => {
              setEditing(record);
              setModalOpen(true);
            }}
          >
            Sửa
          </Button>
        ),
      },
    ],
    [],
  );

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Quản lý thương hiệu"
        description="Thương hiệu dược phẩm và TPCN hiển thị trên storefront."
        extra={
          <Button
            type="primary"
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
          >
            Thêm thương hiệu
          </Button>
        }
      />

      <div className="grid gap-3 rounded-xl border border-[#e8e8e8] bg-white p-4 md:grid-cols-2">
        <Input
          placeholder="Tìm theo tên"
          value={filters.keyword}
          onChange={(e) => setFilters((p) => ({ ...p, keyword: e.target.value }))}
        />
        <Select
          placeholder="Trạng thái"
          allowClear
          value={filters.status || undefined}
          options={[
            { label: "Hoạt động", value: "active" },
            { label: "Ẩn", value: "inactive" },
          ]}
          onChange={(v) => setFilters((p) => ({ ...p, status: v || "" }))}
        />
      </div>

      <div className="rounded-xl border border-[#e8e8e8] bg-white p-4">
        <Table rowKey="_id" loading={loading} columns={columns} dataSource={brands} pagination={{ pageSize: 8 }} />
      </div>

      <BrandFormModal
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit}
        initialValues={editing}
        confirmLoading={submitLoading}
      />
    </div>
  );
};

export default AdminBrandsPage;
