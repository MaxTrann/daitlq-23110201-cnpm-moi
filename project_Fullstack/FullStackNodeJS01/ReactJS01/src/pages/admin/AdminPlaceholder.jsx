import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const AdminPlaceholder = ({ title, description }) => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center rounded-xl border border-dashed border-[#d9d9d9] bg-white p-8 text-center">
      <h2 className="m-0 text-xl font-bold text-[#333]">{title}</h2>
      <p className="mt-3 max-w-md text-sm text-[#888]">
        {description || "Tính năng đang được phát triển trong các giai đoạn tiếp theo của dự án MedCare."}
      </p>
      <Button type="primary" className="mt-6" onClick={() => navigate("/admin/dashboard")}>
        Về Dashboard
      </Button>
    </div>
  );
};

export default AdminPlaceholder;
