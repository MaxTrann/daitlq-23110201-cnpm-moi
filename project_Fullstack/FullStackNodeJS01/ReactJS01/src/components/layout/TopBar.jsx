const TopBar = () => (
  <div className="bg-[#004a85] text-white text-xs md:text-sm">
    <div className="pc-container flex flex-wrap items-center justify-between gap-2 py-2">
      <p className="m-0 font-medium">Hệ thống nhà thuốc MedCare — Chuỗi nhà thuốc uy tín</p>
      <div className="flex flex-wrap items-center gap-4">
        <span>Hotline: <strong>1800 6928</strong></span>
        <span className="hidden sm:inline">|</span>
        <span className="hidden sm:inline">Miễn phí vận chuyển đơn từ 150.000đ</span>
      </div>
    </div>
  </div>
);

export default TopBar;
