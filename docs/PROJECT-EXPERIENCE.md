# LAVA — Website dự án nhiều trang

Hướng thị giác **CHƯA DUYỆT** bởi chủ dự án. Tiếp tục theo hướng đã đề xuất và yêu cầu ngày 04/11/2026. Các đối tượng không gian là thiết kế concept, không phải dữ liệu mặt bằng kinh doanh.

## Hiện trạng và phạm vi

Mốc trước mở rộng: `e08d622`, website một trang, Vite/TypeScript/Three.js, working tree sạch. Giữ nhận diện midnight navy, Manrope, wordmark, mô hình procedural, ảnh chụp thật có credit, các hành vi WebGL/keyboard/touch/fallback. Mở rộng ở source, không đổi framework hoặc thêm dependency chạy sản phẩm.

Owner: `page.ts` sở hữu route/shell và các trang nội dung; `sections.ts` giữ hero, vision, overview, viewer, experience và lightbox dùng lại; `enquiry-page.ts` sở hữu ba bước enquiry; `spaces.ts` là nguồn duy nhất cho danh mục, ID và bốn sơ đồ zoning; `journey.ts` sở hữu lựa chọn/bộ lọc/bản nháp; `main.ts` giữ menu, motion, scene và lightbox. `brand.css` giữ token, `style.css` là stylesheet nguồn duy nhất. Không có stylesheet phủ đè hoặc `!important`.

Đã bỏ renderer landing cũ, form một bước, gallery filmstrip, dữ liệu spaces trùng và 52 quy tắc CSS không còn dùng. Hai hướng hero trước đó được giữ dưới dạng bằng chứng thiết kế; nhánh thử nghiệm `?direction=b` được bỏ khỏi sản phẩm.

## Người dùng và tác vụ

**HYPOTHESIS từ brief**, chưa nghiên cứu người dùng: người quan tâm kiến trúc, đối tác sáng tạo hoặc người tìm loại không gian. Họ vào từ desktop để tìm hiểu và so sánh, hoặc mobile để xem nhanh một không gian rồi lưu. Điều cần tránh: mở sai không gian, mất bản nháp, nhầm enquiry với booking hoặc nhầm ảnh tham khảo là công trình LAVA.

Đường chính: Home → Spaces → lọc nhu cầu/tầng → Chi tiết đúng ID → lưu → Saved spaces → Enquiry → Review → Prepare to share → tải file đúng dữ liệu.

Các nhánh: không có kết quả → reset; chưa lưu gì → trở về danh mục; bỏ lựa chọn → Undo; email sai → sửa giữ dữ liệu; thiếu draft khi mở deep link → tạo enquiry; storage bị chặn → giữ form và tải trực tiếp; xóa draft → xác nhận hoặc hủy; WebGL lỗi → still.

## Màn hình và trạng thái

| URL | Vai trò / quyết định | Trạng thái chính |
| --- | --- | --- |
| `/` | Nhận diện và chọn chương | WebGL, still, loading, fallback |
| `/project/` | Hiểu ý tưởng và cấu trúc | Nội dung biên tập, ảnh có credit |
| `/architecture/` | Khám phá công trình | 3 camera, 2 lighting, reduced detail, keyboard, touch, fallback |
| `/spaces/` | Tìm một không gian | Bộ lọc URL, số kết quả, rỗng, reset, Back |
| `/spaces/workplace/` | Không gian làm việc | Save/unsave, sơ đồ riêng, tải SVG, enquiry theo ID |
| `/spaces/gallery-lounge/` | Không gian gặp gỡ | Như trên, đúng ảnh/nội dung/zoning của lounge |
| `/spaces/meeting-suite/` | Không gian họp | Như trên, zoning phòng họp riêng |
| `/spaces/open-terrace/` | Không gian ngoài trời | Như trên, zoning sân vườn riêng |
| `/experience/` | Khám phá nhịp sinh hoạt | Liên kết đúng không gian, accordion |
| `/gallery/` | Xem hình và nguồn ảnh | Phân loại, lightbox, keyboard, touch, focus restore |
| `/saved/` | Xem lại lựa chọn | Có dữ liệu, rỗng, remove/undo, clear/undo, storage lỗi |
| `/enquiry/` | Nhập nhu cầu | Prefill, selected IDs, validation, autosave trong tab, storage fallback |
| `/enquiry/review/` | Kiểm tra và sửa | Dữ liệu đúng draft, edit giữ dữ liệu, thiếu draft |
| `/enquiry/ready/` | Chuẩn bị chia sẻ | Tải `.txt`, email tùy cấu hình, xác nhận xóa, thiếu draft |
| `/contact/` | Chọn kênh liên hệ và hiểu phạm vi | Enquiry, nguồn dự án, FAQ |
| `/credits/` | Xác thực nguồn ảnh | Tác giả, ảnh, link gốc và license |
| `/privacy/` | Hiểu dữ liệu được xử lý | localStorage/sessionStorage, tải file, liên kết ngoài |
| `404.html` | Phục hồi khi URL sai | HTTP 404 trong preview, link tới Spaces |

## Composition và quyết định

Giữ hướng hero A đã chọn: wordmark và kiến trúc là vật nhận diện. Trang nội dung dùng editorial spread, danh mục dùng lưới ảnh kết hợp bộ lọc, chi tiết chuyển từ ảnh toàn bề ngang sang bản vẽ, Experience dùng timeline, Gallery dùng ảnh lệch nhịp, enquiry dùng cột ngữ cảnh và biểu mẫu. Không nhân một hero/layout qua mọi đoạn nội dung.

Hai cấu trúc được cân nhắc cho màn quyết định: **collection-first** với lọc use/level và so ảnh; **floor-first** với chọn tầng trước rồi xem không gian. Chọn collection-first vì dữ liệu hiện chỉ có bốn spatial concepts và chưa có inventory diện tích/availability. Không dựng floor selector trông như dữ liệu leasing được xác thực. Giữ bộ lọc tầng như một đường tìm bổ sung. Hero A/B thực tế và so sánh cấu trúc gốc nằm trong `DESIGN.md`; đây không phải human approval mới.

Mobile reflow thành một cột, CTA và save cùng ngữ cảnh, chọn tầng nằm dưới use. Sơ đồ dùng số lớn và legend chữ riêng để đọc được trên màn nhỏ. Review/Ready đưa panel chính lên trước phần không gian bổ sung, thay vì bắt người dùng cuộn qua nội dung quảng bá. Gallery đổi thành một cột; navigation dùng native dialog cuộn được.

## Dữ liệu và giới hạn

- Sáu tầng là đếm mô hình gốc. Phân bổ chức năng tầng, tên và zoning là đề xuất thiết kế trong `spaces.ts`.
- Không có diện tích, giá, vị trí, đối tác, live availability, tài khoản, booking hoặc lịch hẹn được xác thực.
- Sáu ảnh thật là architectural references của công trình khác; credit đặt ở detail/gallery và trang credits. Không dùng asset Likova.
- Chỉ IDs lưu trong localStorage. Draft chứa PII dùng sessionStorage theo tab, không nằm trong URL và không gửi lên server. Có xác nhận trước xóa draft.
- Khi inbox chưa cấu hình, thao tác cuối chỉ tải file thật. Không hiển thị trạng thái đã gửi hoặc đặt chỗ thành công.
- Hướng tối cố định theo brief; kiểm cả OS light/dark để đảm bảo website không đổi ngoài ý muốn.

## Quy trình đã áp dụng

UIUX AI Workspace main `5404c183e2e6d09261ddb97b238e09ab56bd5a8a`, đã đối chiếu remote ngày 04/11/2026, working tree chỉ đọc và sạch. Track L + brownfield: kiểm kê owner/ADN, FLOW scenarios, thêm route và state tại nguồn, xóa code cũ, screenshot 6 viewport, taste/static/flow/overlay check và review ảnh độc lập. Skills áp dụng thêm: brownfield-redesign, information-architecture, ux-structure-and-flow-design, responsive-and-device-strategy, state/error recovery, visual-design-direction, design-system-and-components, ui-craft-and-visual-qa, design-critique-and-rationale.

Kết quả kiểm chứng được ghi riêng trong `QA.md`. Checker tĩnh không thay thế browser flow. Điểm review agent không phải kiểm thử người dùng hoặc phê duyệt thiết kế.

### Asset update 04/11/2026

Mô hình procedural ở mốc mở rộng trước đã được thay bằng Modern Office Building, CN Entertainment, CC BY 4.0. Bản đồ màn, ID không gian, zoning sketches và enquiry flow giữ nguyên; model tham khảo được ghi nguồn riêng và không được mô tả là phương án sáu tầng nguyên bản. Chi tiết tại [ASSETS.md](ASSETS.md).
