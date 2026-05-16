# MedCare — Tài liệu thiết kế Database

> **Mục đích:** Overview schema MongoDB khi chuyển từ Campus Shop (bán lẻ chung) sang **MedCare** (nhà thuốc trực tuyến).  
> **Trạng thái:** Phase 1 đã implement (models, seed, API catalog, FE MedCare). Phase 2 (orders, prescriptions) chưa làm.

## Đọc theo thứ tự

| File | Nội dung |
|------|----------|
| [01-nghiep-vu-tham-chieu.md](./01-nghiep-vu-tham-chieu.md) | Học từ Pharmacity, Long Châu; phạm vi MedCare |
| [02-tong-quan-database.md](./02-tong-quan-database.md) | Sơ đồ collection, phase triển khai, map từ DB cũ |
| [03-chi-tiet-collections.md](./03-chi-tiet-collections.md) | Field từng collection (MVP + mở rộng) |
| [04-quy-tac-nghiep-vu.md](./04-quy-tac-nghiep-vu.md) | OTC/Rx, đơn thuốc, tồn kho, HSD |

## Tóm tắt nhanh

- **Giữ & mở rộng:** `users`, `categories`, `products` (đổi tên logic → `medicines` hoặc giữ `products` + thêm field dược phẩm).
- **Thêm MVP MedCare:** `brands`, `medicine_details` (hoặc embed trong product), `batches` (lô/HSD), `addresses`.
- **Phase 2:** `orders`, `order_items`, `prescriptions`, `prescription_images`.
- **Phase 3:** `pharmacy_branches`, `medicine_reminders`, `health_profiles`.

## Quyết định cần bạn chốt trước khi code

1. Collection sản phẩm: đổi tên `products` → `medicines` hay **giữ `products`** để ít sửa API?
2. MVP có **đơn hàng + giỏ** ngay không, hay chỉ catalog + auth (như hiện tại)?
3. **Thuốc kê đơn (Rx):** chỉ hiển thị thông tin + “mua tại nhà thuốc”, hay làm luôn upload đơn (phase 2)?
4. Có cần role **`Pharmacist`** (dược sĩ duyệt đơn) ngoài `User` / `Admin`?

Khi bạn trả lời 4 ý trên, có thể bắt đầu migration + seed dữ liệu mẫu MedCare.
