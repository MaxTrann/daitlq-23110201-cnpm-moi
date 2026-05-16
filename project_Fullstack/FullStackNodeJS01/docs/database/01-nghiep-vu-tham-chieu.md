# Nghiệp vụ tham chiếu — Pharmacity, Long Châu & định hướng MedCare

## 1. Các sàn tham chiếu (Việt Nam)

| Nguồn | Điểm mạnh nghiệp vụ | Áp dụng cho MedCare |
|-------|---------------------|---------------------|
| **Pharmacity** | Danh mục theo **bệnh/cơ quan** (tim mạch, tiêu hóa…); TPCN, mỹ phẩm, thiết bị y tế; **Đặt đơn thuốc**; tư vấn dược sĩ; tìm cửa hàng; khuyến mãi | Cấu trúc category, trang chủ theo nhóm bệnh, CTA “Liên hệ dược sĩ” |
| **Long Châu (FPT)** | Chat dược sĩ + **gửi ảnh đơn**; tra cứu thuốc chính hãng; vaccine; điểm thưởng; lịch sử mua | Luồng prescription upload, hotline/Zalo tư vấn (phase 2+) |
| **Quy định VN** | **OTC** (~243 hoạt chất) được bán online lẻ; **Rx** thường **không** bán online lẻ (chủ yếu tại quầy có đơn) | Bắt buộc field `drugClass`, `allowedOnlineSale` |

*Tài liệu pháp lý tham khảo:* Thông tư 07/2017/TT-BYT (danh mục không kê đơn), quy định bán thuốc qua TMĐT (cơ sở phải tư vấn trực tuyến).

---

## 2. Phân loại sản phẩm (chuẩn ngành)

MedCare nên dùng **loại hàng hóa** (`productType`), không chỉ “danh mục thời trang”:

| `productType` | Mô tả | Bán online MedCare (đề xuất) |
|---------------|--------|------------------------------|
| `medicine_otc` | Thuốc không kê đơn | ✅ Có |
| `medicine_rx` | Thuốc kê đơn | ⚠️ Chỉ xem / đặt trước + duyệt đơn / hoặc “chỉ bán tại nhà thuốc” |
| `functional_food` | TPCN | ✅ Có (ghi rõ không thay thuốc chữa bệnh) |
| `medical_device` | Thiết bị y tế (nhiệt kế, máy đo…) | ✅ Có |
| `cosmetic` | Dược mỹ phẩm | ✅ Có |
| `personal_care` | Chăm sóc cá nhân (khẩu trang, vitamin…) | ✅ Có |

**Thuộc tính bắt buộc trên PDP (trang chi tiết):**

- Tên thương mại + **hoạt chất** + hàm lượng  
- **Số đăng ký** (SDK) / mã SKU nội bộ  
- Hãng / xuất xứ  
- Công dụng, liều dùng, **cảnh báo** (phụ nữ có thai, trẻ em…)  
- Hạn sử dụng (theo **lô** tồn kho)  
- Giá, tồn, quy cách (hộp 3 vỉ x 10 viên…)

---

## 3. Tính năng theo Pharmacity / Long Châu (map phase)

### Đã có trong project (giữ, đổi brand)

- Đăng ký / OTP email / đăng nhập JWT / quên mật khẩu  
- Profile User & Admin  
- Danh mục + sản phẩm + lọc + tìm kiếm + admin CRUD  

### Nên có — **Phase 1 (MVP MedCare)**

- Đổi taxonomy category → **nhóm bệnh / cơ quan** + **TPCN / thiết bị**  
- Product schema **dược phẩm** (`drugClass`, `activeIngredient`, `dosageForm`, …)  
- Chỉ cho phép add-to-cart với `allowedOnlineSale: true`  
- Banner “**Tư vấn dược sĩ**” (link Zalo/hotline — không cần DB)  
- Seed data thuốc OTC + vitamin mẫu  

### Phase 2 (đồ án nâng cao)

- **Giỏ hàng** + **đơn hàng** + địa chỉ giao  
- **Upload đơn thuốc** (`prescriptions`) + trạng thái duyệt  
- Role **Pharmacist** duyệt đơn Rx  
- **Lô hàng** (`batches`): số lô, HSD, FEFO xuất kho  

### Phase 3 (tùy chọn)

- Tìm **chi nhánh** (`pharmacy_branches`)  
- **Nhắc uống thuốc** (`medicine_reminders`)  
- **Hồ sơ sức khỏe** (`health_profiles`)  
- Mã giảm giá, điểm thưởng  

---

## 4. Định vị MedCare (đề xuất)

| Hạng mục | Đề xuất |
|----------|---------|
| Tên | **MedCare** — “Nhà thuốc trực tuyến” |
| Đối tượng | Người dân mua **OTC, TPCN, thiết bị y tế** tiện lợi |
| Khác biệt đồ án | UI sạch + **thông tin thuốc đầy đủ** + quy trình **đơn thuốc** (phase 2) |
| Không làm (scope tránh quá tải) | Bán buôn B2B, vaccine tiêm tại chỗ, kiểm tra sức khỏe tại quầy |

---

## 5. So sánh nhanh: DB hiện tại vs MedCare

| Hiện tại (Campus Shop) | MedCare cần thêm |
|------------------------|------------------|
| `name`, `price`, `salePrice`, `images`, `stock`, `sold` | `productType`, `drugClass`, `activeIngredient`, `registrationNo`, `dosageForm`, `packaging`, `manufacturerId` |
| Category: Giày, Thời trang… | Category: Tim mạch, Tiêu hóa, TPCN, Khẩu trang… |
| `isNew`, `isBestSeller`, `isSale` | Giữ + `requiresPharmacistAdvice`, `allowedOnlineSale` |
| Không có đơn hàng | `orders`, `order_items`, `carts` (phase 2) |
| Không có đơn thuốc | `prescriptions` (phase 2) |

---

## 6. Tham khảo link (khi thiết kế FE sau này)

- [Pharmacity](https://www.pharmacity.vn/) — danh mục tủ thuốc, đặt đơn thuốc, tư vấn  
- [Long Châu](https://nhathuoclongchau.com.vn/) — phân biệt OTC/Rx, chat dược sĩ  

*Tài liệu này chỉ phục vụ học tập / đồ án; triển khai thương mại thật cần giấy phép kinh doanh dược và tuân thủ pháp luật.*
