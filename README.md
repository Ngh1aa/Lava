# LAVA — Harpa Concert Hall

Website biên tập về **một công trình cụ thể: Harpa Concert Hall, Reykjavík**. Brand navy, Syncopate Bold cho wordmark và Manrope cho nội dung. LAVA là independent architectural study, không phải website chính thức hay đơn vị thiết kế Harpa.

## Trải nghiệm hiện hành

Trang chủ bảy section: hero ảnh thật, giới thiệu công trình, hồ sơ dự án, hai chương Architecture/Spaces, nghiên cứu mặt đứng, đời sống công cộng và Gallery. Navigation chính: The building, Architecture, Spaces, Gallery, Contact. Sáu ảnh của cùng công trình, tự host với bản 640/960/1600 và credit theo ảnh.

Trang Architecture đọc hình khối/mặt đứng/ánh sáng bằng ảnh thật. Spaces là bốn góc đọc kiến trúc, không phải inventory cho thuê. Không có zoning hoặc số tầng tưởng tượng. Viewer văn phòng cũ đã bỏ: **chưa có mô hình Harpa 3D có quyền sử dụng được xác minh**.

17 URL cũ và 404 vẫn render HTML riêng để giữ deep link. Các ID /spaces/workplace/, gallery-lounge/, meeting-suite/, open-terrace/ nay lần lượt mở foyer, harbour edge, crystalline facade, interior geometry. Saved và enquiry được giữ tương thích, không quảng bá trong navigation. Enquiry vẫn tạo file trên thiết bị, không gửi server hoặc giả booking. Inbox chỉ dùng khi có VITE_CONTACT_EMAIL xác thực.

## Local

Node 24, npm:

```bash
npm ci
npm run dev
npm run build
npm run preview
```

Dev: http://127.0.0.1:5173/ . Preview: http://127.0.0.1:4173/ . Chưa có public deployment được xác nhận.

```bash
npm run lint
npm run check:design
npm test
```

Vite / TypeScript strict, CSS tokens, native dialog và browser storage. Không có dependency 3D chưa sử dụng. Source: src/page.ts (routes), src/content.ts (ảnh/nguồn/nội dung), src/spaces.ts (các góc đọc không gian), src/main.ts (menu/gallery), src/journey.ts (luồng legacy), src/style.css và brand.css.

Các test viewer GLB, bộ lọc leasing và zoning cũ không còn áp dụng; được thay bằng regression Harpa (17 routes, 7 widths, đúng ảnh/credit, menu/focus, gallery, enquiry, project facts không chồng chữ, CTA SVG và axe). Không dùng kết quả Lighthouse/independent review của concept cũ để chấm bản Harpa. Đo và giới hạn hiện hành: docs/QA.md.

Nguồn và giấy phép: [ASSETS](docs/ASSETS.md), [notices](THIRD_PARTY_NOTICES.md). UIUX Workspace dùng chỉ đọc; hướng dẫn craft đã áp dụng trong vòng chuyển công trình này. Branch feat/lava-architectural-experience, [PR #1](https://github.com/Ngh1aa/Lava/pull/1); không tự merge main.
