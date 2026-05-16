# Chi tiết Collections — MedCare

Quy ước: `*` = bắt buộc MVP MedCare | `(P2)` = Phase 2 | `(P3)` = Phase 3

---

## 1. `users` (mở rộng từ hiện tại)

| Field | Type | Mô tả |
|-------|------|--------|
| `name`* | String | Họ tên |
| `email`* | String | Unique, lowercase |
| `password`* | String | Bcrypt hash |
| `role`* | Enum | `User` \| `Admin` \| `(P2) Pharmacist` |
| `isEmailVerified`* | Boolean | Sau OTP đăng ký |
| `phone` | String | SĐT liên hệ / giao hàng |
| `address` | String | Địa chỉ mặc định (text) — hoặc chuyển sang `addresses` |
| `avatar` | String | URL |
| `(P2) dateOfBirth` | Date | Tư vấn liều trẻ em |
| `(P2) gender` | Enum | `male` \| `female` \| `other` |
| `createdAt`, `updatedAt` | Date | Timestamps |

**Index:** `{ email: 1 }` unique

---

## 2. `categories`

| Field | Type | Mô tả |
|-------|------|--------|
| `name`* | String | VD: "Tim mạch", "TPCN - Vitamin" |
| `slug`* | String | Unique, URL-friendly |
| `description` | String | Mô tả ngắn |
| `parentId` | ObjectId \| null | Danh mục cha (cây) |
| `categoryKind`* | Enum | `medicine` \| `supplement` \| `device` \| `cosmetic` \| `personal_care` |
| `icon` | String | Icon URL hoặc key |
| `sortOrder` | Number | Thứ tự hiển thị |
| `isActive`* | Boolean | Ẩn/hiện |
| `timestamps` | | |

**Ví dụ seed (theo Pharmacity):**

- Tim mạch, Tiêu hóa, Da - Tóc - Móng, Vitamin - Khoáng chất  
- TPCN tổng hợp, Thiết bị y tế, Mẹ và bé  

**Index:** `{ slug: 1 }` unique, `{ parentId: 1, isActive: 1 }`

---

## 3. `brands` (mới)

| Field | Type | Mô tả |
|-------|------|--------|
| `name`* | String | DHG Pharma, Sanofi, … |
| `slug`* | String | Unique |
| `country` | String | Việt Nam, Pháp, … |
| `logo` | String | URL |
| `isActive` | Boolean | |
| `timestamps` | | |

---

## 4. `products` (sản phẩm / thuốc — core catalog)

### 4.1 Thông tin chung (giữ + mở rộng)

| Field | Type | Mô tả |
|-------|------|--------|
| `name`* | String | Tên hiển thị |
| `slug`* | String | Unique |
| `sku`* | String | Mã nội bộ MedCare |
| `barcode` | String | Mã vạch |
| `shortDescription` | String | Card danh sách |
| `description` | String | Mô tả HTML/text đầy đủ |
| `images` | [String] | Ảnh sản phẩm |
| `category`* | ObjectId | ref `categories` |
| `brandId` | ObjectId | ref `brands` |
| `price`* | Number | Giá niêm yết (VND) |
| `salePrice` | Number \| null | Giá khuyến mãi |
| `stock`* | Number | Tồn **tổng** (sync từ batches hoặc nhập tay MVP) |
| `sold` | Number | Đã bán |
| `unitLabel` | String | "Hộp", "Chai 100ml" |
| `packagingDescription` | String | "3 vỉ x 10 viên" |

### 4.2 Phân loại dược

| Field | Type | Mô tả |
|-------|------|--------|
| `productType`* | Enum | Xem bảng dưới |
| `drugClass`* | Enum | `otc` \| `rx` \| `not_applicable` |
| `allowedOnlineSale`* | Boolean | `false` → không add cart online |
| `requiresPharmacistAdvice` | Boolean | Hiện badge "Hỏi dược sĩ" |

**`productType` enum:**

```
medicine_otc
medicine_rx
functional_food
medical_device
cosmetic
personal_care
```

**Quy tắc gợi ý:**

| productType | drugClass | allowedOnlineSale |
|-------------|-----------|-------------------|
| medicine_otc | otc | true |
| medicine_rx | rx | false (MVP) |
| functional_food | not_applicable | true |
| medical_device | not_applicable | true |

### 4.3 Marketing (giữ từ Campus Shop)

| Field | Type |
|-------|------|
| `isNew` | Boolean |
| `isBestSeller` | Boolean |
| `isSale` | Boolean |
| `isActive` | Boolean |

---

## 5. `medicine_details` (1-1 với `products` — khuyến nghị tách)

Chỉ tạo khi `productType` thuộc nhóm thuốc/TPCN có thông tin dược.

| Field | Type | Mô tả |
|-------|------|--------|
| `productId`* | ObjectId | Unique ref products |
| `activeIngredient`* | String | Hoạt chất (Paracetamol 500mg…) |
| `registrationNo` | String | Số đăng ký lưu hành |
| `dosageForm` | Enum | `tablet` \| `capsule` \| `syrup` \| `cream` \| `injection` \| `other` |
| `concentration` | String | "500mg", "5mg/ml" |
| `indications` | String | Công dụng |
| `usage` | String | Liều dùng / cách dùng |
| `contraindications` | String | Chống chỉ định |
| `sideEffects` | String | Tác dụng phụ |
| `warnings` | String | Cảnh báo (có thai, lái xe…) |
| `storage` | String | Bảo quản (nhiệt độ, tránh ánh sáng) |
| `prescriptionRequired` | Boolean | Sync với drugClass === rx |

**Index:** `{ productId: 1 }` unique, `{ activeIngredient: "text" }`

---

## 6. `product_batches` (P1 nếu cần HSD — khuyến nghị có)

| Field | Type | Mô tả |
|-------|------|--------|
| `productId`* | ObjectId | |
| `batchCode`* | String | Số lô NSX |
| `manufacturingDate` | Date | |
| `expiryDate`* | Date | Hạn dùng |
| `quantity`* | Number | Tồn lô này |
| `importPrice` | Number | Giá nhập (admin) |
| `isActive` | Boolean | |

**Nghiệp vụ:** Xuất kho ưu tiên lô **gần hết hạn** (FEFO). `products.stock` = sum(`batches.quantity`).

---

## 7. `addresses` (P1/P2)

| Field | Type | Mô tả |
|-------|------|--------|
| `userId`* | ObjectId | |
| `recipientName`* | String | |
| `phone`* | String | |
| `province` | String | Tỉnh/TP |
| `district` | String | Quận/huyện |
| `ward` | String | Phường/xã |
| `streetAddress`* | String | Số nhà, đường |
| `isDefault` | Boolean | |
| `label` | String | "Nhà", "Cơ quan" |

---

## 8. `carts` & `cart_items` (P2)

### `carts`

| Field | Type |
|-------|------|
| `userId`* | ObjectId unique |
| `updatedAt` | Date |

### `cart_items`

| Field | Type |
|-------|------|
| `cartId`* | ObjectId |
| `productId`* | ObjectId |
| `quantity`* | Number |
| `unitPrice` | Number snapshot |
| `requiresPrescription` | Boolean |

**Ràng buộc:** Không thêm cart nếu `allowedOnlineSale === false`.

---

## 9. `orders` & `order_items` (P2)

### `orders`

| Field | Type | Mô tả |
|-------|------|--------|
| `orderCode`* | String | MED202603160001 |
| `userId`* | ObjectId | |
| `status`* | Enum | `pending` \| `confirmed` \| `shipping` \| `delivered` \| `cancelled` |
| `paymentStatus` | Enum | `unpaid` \| `paid` \| `cod` |
| `paymentMethod` | Enum | `cod` \| `bank_transfer` |
| `shippingAddress`* | Object | Snapshot địa chỉ |
| `subtotal` | Number | |
| `shippingFee` | Number | |
| `discount` | Number | |
| `totalAmount`* | Number | |
| `note` | String | Ghi chú khách |
| `(P2) prescriptionId` | ObjectId | Nếu đơn có thuốc Rx |
| `(P2) pharmacistId` | ObjectId | Dược sĩ duyệt |
| `(P2) pharmacistNote` | String | |
| `timestamps` | | |

### `order_items`

| Field | Type |
|-------|------|
| `orderId`* | ObjectId |
| `productId`* | ObjectId |
| `productName` | String snapshot |
| `sku` | String |
| `quantity`* | Number |
| `unitPrice`* | Number |
| `lineTotal`* | Number |
| `batchId` | ObjectId optional |

---

## 10. `prescriptions` (P2 — “Đặt đơn thuốc”)

| Field | Type | Mô tả |
|-------|------|--------|
| `userId`* | ObjectId | |
| `imageUrls`* | [String] | Ảnh đơn chụp từ điện thoại |
| `status`* | Enum | `pending` \| `reviewing` \| `approved` \| `rejected` \| `completed` |
| `customerPhone` | String | |
| `customerNote` | String | Triệu chứng / yêu cầu |
| `pharmacistId` | ObjectId | Người duyệt |
| `reviewedAt` | Date | |
| `rejectReason` | String | |
| `orderId` | ObjectId | Đơn hàng phát sinh sau duyệt |
| `timestamps` | | |

### `prescription_items` (sau khi dược sĩ nhập)

| Field | Type |
|-------|------|
| `prescriptionId`* | ObjectId |
| `productId` | ObjectId \| null nếu chưa map |
| `medicineName` | String text trên đơn |
| `quantity` | Number |
| `dosageInstruction` | String |

---

## 11. `pharmacy_branches` (P3)

| Field | Type |
|-------|------|
| `name`, `slug` | String |
| `phone` | String |
| `address` | Object (province, district, street) |
| `location` | GeoJSON Point |
| `openingHours` | String |
| `isActive` | Boolean |

---

## 12. `medicine_reminders` (P3)

| Field | Type |
|-------|------|
| `userId` | ObjectId |
| `productId` | ObjectId |
| `dosage` | String |
| `times` | [String] HH:mm |
| `startDate`, `endDate` | Date |
| `isActive` | Boolean |

---

## 13. `health_profiles` (P3 — dữ liệu nhạy cảm)

| Field | Type |
|-------|------|
| `userId` | ObjectId unique |
| `allergies` | [String] |
| `chronicConditions` | [String] |
| `currentMedications` | [String] |
| `bloodType` | String |

*Lưu ý bảo mật:* chỉ user đó + pharmacist/admin được đọc; không log plaintext.

---

## 14. Collection giữ nguyên (auth)

### `otps`

Giữ như hiện tại: `email`, `otpHash`, `type` (`register` \| `password_reset`), `expiresAt`, `attempts`.

---

## 15. Ví dụ document mẫu

### Product OTC

```json
{
  "name": "Panadol Extra 500mg",
  "slug": "panadol-extra-500mg",
  "sku": "MED-OTC-001",
  "productType": "medicine_otc",
  "drugClass": "otc",
  "allowedOnlineSale": true,
  "requiresPharmacistAdvice": false,
  "category": "ObjectId(tiêu-hóa)",
  "brandId": "ObjectId(GSK)",
  "price": 45000,
  "salePrice": 39900,
  "stock": 120,
  "unitLabel": "Hộp",
  "packagingDescription": "Hộp 12 vỉ x 2 viên",
  "isActive": true
}
```

### Medicine detail đi kèm

```json
{
  "productId": "ObjectId(...)",
  "activeIngredient": "Paracetamol 500mg, Caffeine 65mg",
  "registrationNo": "VD-12345-18",
  "dosageForm": "tablet",
  "indications": "Giảm đau, hạ sốt",
  "usage": "Người lớn: 1-2 viên/lần, tối đa 8 viên/ngày",
  "warnings": "Không dùng quá liều. Thận trọng khi có bệnh gan."
}
```

---

## 16. API endpoints gợi ý (khi implement)

| Nhóm | Endpoint |
|------|----------|
| Catalog | `GET /products?productType=&drugClass=&category=` |
| Chi tiết | `GET /products/:id` (+ populate `medicine_details`, `brand`) |
| Admin | CRUD products, batches, brands, categories |
| P2 | `POST /prescriptions`, `PATCH /prescriptions/:id/approve` |
| P2 | `POST /orders`, `GET /orders/me` |

*Tài liệu chi tiết nghiệp vụ OTC/Rx: [04-quy-tac-nghiep-vu.md](./04-quy-tac-nghiep-vu.md)*
