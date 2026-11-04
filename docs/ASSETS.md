# Assets và giấy phép

Cập nhật 04/11/2026 theo yêu cầu dùng **ảnh chụp thật trên mạng**. Website dùng sáu ảnh Unsplash bên dưới, lưu local dạng WebP; không hotlink lúc người dùng mở website. Workplace và Meeting có ảnh nội thất phù hợp công năng, bổ sung sau review độc lập.

## Ảnh chụp đang dùng

| File | Ảnh / tác giả | Trang gốc | Giấy phép |
| --- | --- | --- | --- |
| `public/images/arrival.webp` | Copenhagen Opera House về đêm — Rasmus Lauridsen (@captainslow) | [bsTw-CKKhx4](https://unsplash.com/photos/modern-building-illuminated-at-night-with-warm-interior-lighting-bsTw-CKKhx4) | Unsplash License, trang ảnh ghi Free to use |
| `public/images/lounge.webp` | Ghế và cửa sổ tại Lugdunum Museum, Lyon — Sébastien Lavalaye (@pelloche), ảnh film Hasselblad / Kodak Portra 400 | [kXKQEhfd06o](https://unsplash.com/photos/a-modern-bench-sits-beside-a-large-window-kXKQEhfd06o) | Unsplash License, trang ảnh ghi Free to use |
| `public/images/terrace.webp` | Mái thép và terrace Neue Nationalgalerie, Berlin — Caio Arbulu (@caioarbulu) | [bvx2_DCO9GA](https://unsplash.com/photos/modern-building-with-a-large-terrace-under-a-blue-sky-bvx2_DCO9GA) | Unsplash License, trang ảnh ghi Free to use |
| `public/images/facade.webp` | Mặt đứng chiếu sáng ở Hamburg, ảnh đen trắng — Maik Winnecke (@maik_wi) | [U2YVQBUMq40](https://unsplash.com/photos/modern-building-facade-illuminated-at-night-U2YVQBUMq40) | Unsplash License, trang ảnh ghi Free to use |
| `public/images/workplace.webp` | Không gian làm việc mở — Israel Andrade (@israelandrxde) | [YI_9SivVt_s](https://unsplash.com/photos/people-sitting-on-chair-in-front-of-computer-YI_9SivVt_s) | Unsplash License, trang ảnh ghi Free to use, kiểm 04/11/2026 |
| `public/images/meeting.webp` | Phòng họp tại Sunday Digital, Munich — Nastuh Abootalebi | [J1rNS2qv8BQ](https://unsplash.com/photos/pink-dining-table-with-four-chairs-inside-room-J1rNS2qv8BQ) | Unsplash License, trang ảnh ghi Free to use, kiểm 04/11/2026 |

Đã kiểm trang nguồn, tác giả, vị trí/mô tả và nhãn giấy phép ngày 03–04/11/2026. Không chọn Unsplash+ trả phí, 3D rendering hoặc ảnh gắn nhãn AI. Không tạo bằng imagegen. Ảnh được resize/nén qua CDN và WebP codec của browser; không thay nội dung. Có biến thể 640px và 960px (nếu ảnh nguồn đủ rộng), `srcset/sizes` chọn theo layout/DPR. Ảnh mở đầu danh mục được eager/high priority; các ảnh phía dưới lazy-load. Alt, tác giả, nguồn và kích thước chính quản lý tại `src/content.ts`.

Đây là **ảnh tham khảo kiến trúc**, không phải ảnh của công trình LAVA hay bằng chứng quan hệ với chủ công trình/tác giả. Spaces có nhãn Photo reference và credit; lightbox đồng bộ category, tác giả và link trang ảnh theo từng ảnh. Alt mô tả đúng công trình trong ảnh. Nội dung và credit quản lý tập trung trong `src/content.ts`.

[Unsplash License](https://unsplash.com/license) cho phép tải, sử dụng và phân phối ảnh trong các dự án, kể cả thương mại, theo các điều kiện của giấy phép; không phải CC0 hoặc quyền độc quyền. Không bán ảnh nguyên bản hoặc gom thành dịch vụ ảnh cạnh tranh. Credit được giữ dù giấy phép không bắt buộc. Xem thêm [Unsplash Help](https://help.unsplash.com/en/articles/2612315-can-i-use-unsplash-images-for-personal-or-commercial-projects).

## URL tải đã dùng

- Arrival: https://images.unsplash.com/photo-1772193985406-a6933460834d?auto=format&fit=max&w=1600&q=85&fm=webp
- Lounge: https://images.unsplash.com/photo-1750437917600-6536b26fe87d?fit=max&w=1280&h=1280&q=76&fm=webp
- Terrace: https://images.unsplash.com/photo-1779568855025-db542fc28684?fit=max&w=1100&h=2000&q=76&fm=webp
- Facade: https://images.unsplash.com/photo-1772081914443-a6b6e6f29035?auto=format&fit=max&w=1600&q=85&fm=webp
- Workplace: https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=1600&q=82&fm=webp
- Meeting: https://images.unsplash.com/photo-1497366858526-0766cadbe8fa?w=1600&q=82&fm=webp

## Tài sản còn lại

| File | Nguồn | Quyền / mục đích |
| --- | --- | --- |
| `images/hero.webp` | Render alpha từ Modern Office Building, CN Entertainment, CC BY 4.0 | Giữ nền trong suốt để wordmark không bị nền ảnh che trong chế độ still/WebGL fallback. Pixel alpha góc được kiểm trong browser. |
| `images/exterior.webp`, `images/structure.webp` | Render từ GLB Modern Office Building trong `src/architecture.ts` | Bản render thích ứng theo CC BY 4.0; phục vụ fallback của trải nghiệm 3D, không trình bày như ảnh chụp. Tái tạo bộ ảnh model bằng dev server + `node scripts/render-assets.mjs`. |
| `favicon.svg` | Wordmark hình học LAVA | Nội dung gốc, không lấy logo bên thứ ba. |
| Manrope Latin 400/500/600/700 | Manrope Project Authors qua Fontsource | SIL OFL 1.1; `public/licenses/Manrope-OFL.txt`. |
| Three.js | Three.js authors | MIT; `public/licenses/Three-MIT.txt`. |

Không lấy tài sản từ Likova. Các ảnh imagegen trước đây đã được thay trong source hiện tại; provenance cũ chỉ còn trong Git history. Không dùng chúng làm ảnh hiện hành.

## Mô hình 3D thay thế procedural study — 04/11/2026

- **Modern Office Building**, tác giả **CN Entertainment**, [trang gốc](https://sketchfab.com/3d-models/modern-office-building-3f54b8d7a7064b0da523c49187efcf60). [Sketchfab API](https://api.sketchfab.com/v3/models/3f54b8d7a7064b0da523c49187efcf60) xác nhận downloadable, 2,985 faces, license CC Attribution và link CC BY 4.0. Không lấy model của Likova.
- File `public/models/modern-office.glb`: 1,719,000 bytes. Bản tải công khai từ [Ai2 Objaverse](https://huggingface.co/datasets/allenai/objaverse/resolve/main/glbs/000-011/3f54b8d7a7064b0da523c49187efcf60.glb); database ghi nguồn Allen Institute for AI (ODC-By), từng model theo giấy phép riêng. GLB nhúng đúng title/author/source/CC-BY-4.0 trong `asset.extras`, giữ nguyên binary và metadata.
- SHA256: `3b4770f1d403b09da953a743c9fdeba00418a86b91fde96bb967de9e84c0a387`.
- [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) cho phép chia sẻ/chỉnh sửa, kể cả thương mại, với credit, link giấy phép và chỉ rõ sửa đổi. [Notice đi cùng asset](../public/licenses/Modern-Office-Building.txt).
- Thích ứng runtime: ẩn nền sân nguồn, chuẩn hóa tỷ lệ/đặt camera; thay transmission bằng reflective glass để giảm render pass; chỉnh màu backing và emissive, môi trường và ánh sáng. Không thêm tầng để giả mô hình gốc là thiết kế LAVA. Chương trình sáu tầng và zoning là đề xuất độc lập.
- `hero.webp`, `exterior.webp`, `facade-view.webp`, `structure.webp` và bốn bản `*-mobile.webp` được render lại từ GLB này bằng dev server + `node scripts/render-assets.mjs`. Credit trên `/architecture/` và `/credits/#model-credit` áp dụng cho cả GLB và ảnh render. Model và ảnh đều tự host, không gọi Sketchfab/Hugging Face khi mở website.
