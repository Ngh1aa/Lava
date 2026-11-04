# LAVA — QA cho website dự án nhiều trang

Cập nhật 04/11/2026. Bản build Vite production phục vụ qua HTTP local `http://127.0.0.1:4173/`. Branch `feat/lava-architectural-experience`; [PR #1](https://github.com/Ngh1aa/Lava/pull/1). Không có production deployment được xác nhận; hướng thiết kế **CHƯA DUYỆT** bởi chủ dự án.

## Cập nhật GLB — kiểm chứng mới nhất

Source `1324000617d70a28980b4d1503622497a301e73a`. Thay procedural study bằng Modern Office Building / CN Entertainment / CC BY 4.0. Model tự host 1.72 MB; credit và các điều chỉnh được ghi trong ASSETS và license notice.

- **PASS:** lint, TypeScript/build, 53 tokens / 20 contrast pairs; **35/35 Playwright**, 0 skipped/flaky/unexpected. Kết quả gốc: `qa/model-update/tests-final.json`.
- **PASS:** GLB thực sự được vẽ (kiểm pixels), metadata/credit, ba camera, lighting/quality/orbit, touch on-demand, still theo từng view/mobile; GLB 503 hoặc hỏng đều có fallback và không pageerror. Static mount `/Lava/` tải được GLB.
- **PASS trong phạm vi kiểm:** 17 routes tại bảy chiều rộng; axe page families và state hiện có; ảnh render thật ở 375/390/768/1280/1440/1920. Console capture 0 lỗi. Đã xem ảnh hero, viewer, mobile still/WebGL, daylight và credit. Viewer mobile bỏ overscan gây crop; poster mobile render riêng.
- Workspace static checker: 3 HTML bị ảnh hưởng, 0 lỗi; cảnh báo `#0000` do CSS build dùng transparent. Taste Architecture: 0 lỗi, 3 cảnh báo đã xem; chữ credit bắt đầu x=20px, cảnh báo mép là box paragraph; mô tả là nội dung góc nhìn theo brief. Không sửa checker.
- Lighthouse production local, Chrome headless, chạy tuần tự, **Home Performance 99 mobile / 100 desktop**, Accessibility / Best Practices / SEO 100 cả hai. Mobile LCP 2.1 s, TBT 0 ms, CLS 0.008; desktop LCP 0.7 s, TBT 0 ms, CLS 0.041. Lượt đầu desktop 86 / TBT 320 ms; đã bỏ room prefilter trong hero, giữ cho explorer và đo lại. Báo cáo `qa/model-update/lighthouse-optimized-*`.
- Điểm review độc lập và bảng đo bên dưới thuộc baseline trước thay GLB. Không dùng chúng làm điểm review của model mới. Kết quả hiện hành nằm ở `modelUpdate` trong qa-summary.json. Đây là đo lab; thiết bị thật, screen reader thủ công, field CWV và public deployment vẫn UNKNOWN.

## Kiểm chứng kỹ thuật và hành vi (baseline nhiều trang)

| Kiểm tra | Kết quả | Phạm vi / bằng chứng |
| --- | --- | --- |
| TypeScript strict / build | PASS | `npm run build`, 17 trang HTML + 404, assets tự host |
| ESLint | PASS | `npm run lint` |
| Token / contrast source | PASS | `npm run check:design`: 53 tokens, 20 cặp contrast, không `!important` hoặc raw UI colors trong component CSS |
| Browser tests | PASS ở lượt kiểm mới nhất | `qa/project-tests.json`; Chrome 156 headless Windows. Số lượng và thời gian chính xác trong `docs/qa-summary.json`; CI theo SHA ở PR |
| Reflow đa trang | PASS trong browser emulation | 17 route × 320/375/390/768/1280/1440/1920px: một h1, không document overflow/text clipping/asset error trong phạm vi kiểm |
| Native route / static hosting | PASS | Deep link + refresh từng route; thêm HTTP server riêng dưới `/Lava/` kiểm nested assets/srcset, chọn không gian, enquiry/review và saved |
| URL cũ / 404 | PASS | Anchor từ trang một trang chuyển tới route đúng; preview redirect 308 cho URL thiếu `/`; URL sai trả 404 với đường phục hồi |
| Bộ lọc | PASS | Use + level, count/empty/reset, URL, history Back và breadcrumb giữ filter |
| Shortlist | PASS | Lưu đúng ID, reload, remove, Undo, clear/Undo, empty state, count đồng bộ; storage không ghi được thì báo lỗi thật |
| Chi tiết / zoning | PASS | Đúng tên/ảnh theo ID, bốn sơ đồ riêng có tên accessible và download SVG đúng đối tượng |
| Enquiry xuyên trang | PASS | Thiếu/sai → sửa → review → edit → reload → review → ready → file chứa đúng thông tin và selected spaces; không POST, không báo đã gửi |
| Privacy / history | PASS | Bỏ không gian rồi refresh không thêm lại; clear draft có Cancel/Confirm; Back sau clear không khôi phục draft đã xóa |
| Storage recovery | PASS | Dữ liệu không hợp lệ được lọc, review/ready thiếu draft có hướng tạo mới; browser chặn storage giữ form và tải file trực tiếp |
| Gallery | PASS | Credit/ảnh/tên đúng, bộ lọc, điều hướng trong tập ảnh đang chọn, keyboard, Escape, swipe và focus restore |
| 3D / fallback | PASS | WebGL canvas thật, camera làm thay đổi pixels, Dusk/Daylight, Reduce detail, xoay bằng nút; touch tải khi yêu cầu, dispose khi chọn Still view; constructor failure và context loss có fallback |
| Reduced motion | PASS trong trạng thái kiểm | Tắt intro/reveal/parallax/interpolation, không transition ảnh/canvas |
| Không JavaScript | PASS trong phạm vi kiểm | HTML đọc được, link ảnh/native route dùng được, submit bị khóa để PII không rơi vào GET |
| axe WCAG 2.1 A/AA | PASS trong audit tự động | Mọi page family và saved/review có dữ liệu; thêm menu mobile, form lỗi và lightbox. Tags gồm `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa` |
| Runtime dependency audit | PASS | `npm audit --omit=dev`, 0 vulnerabilities tại lượt kiểm |

`PASS` không đồng nghĩa chứng nhận WCAG hoặc đầy đủ tình huống sản xuất. Chrome/Chromium emulation không thay thiết bị iOS/Android thật.

## UIUX AI Workspace

Main `5404c183e2e6d09261ddb97b238e09ab56bd5a8a`, đã đối chiếu remote ngày 04/11/2026, working tree nguồn kiến thức sạch và chỉ đọc.

- **static-check:** 18 HTML, 0 lỗi.
- **flow-check:** 0 lỗi chắc chắn ở source; checker tự ghi runtime UNKNOWN. Các luồng ở bảng trên có kiểm browser riêng; không đổi UNKNOWN tĩnh thành chứng minh runtime.
- **taste-check:** các page family ở 390/768/1280/1440px, cả OS light/dark và reflow 320, `--layout strict`. Kết quả mỗi route trong `qa/taste-*.json`; website giữ dark theme theo brand. Kết quả và tổng hợp cuối trong `qa-summary.json`.
- **overlay-check:** so với `e08d622`, 0 lỗi, 1 cảnh báo đã review. `journey.ts` có annotation `brownfield-allow` theo cơ chế chính thức của checker: DOM query/append chỉ cập nhật state trong feedback slots do renderer sở hữu, selected-space rows và review values; không thay layout hoặc reparent UI. Sửa trực tiếp stylesheet/renderer nguồn, xóa code cũ, không thêm lớp CSS đè.
- **check-brand.py:** không dùng kết quả kiểm dashboard tokens không có consumer trong LAVA làm bằng chứng contrast. Kiểm trực tiếp 20 cặp semantic token đang dùng và browser axe/taste. Không bổ sung token thừa hoặc chỉnh checker để qua.

Cảnh báo taste đã xem theo nhóm: headline/editorial xuống dòng chủ đích, mô tả kiến trúc theo brief, empty state cần ngữ cảnh, nhãn ảnh và widow. Không che cảnh báo bằng cờ bỏ kiểm. Tránh nhầm glyph nhỏ với hit area: controls/credit links có min-height 44px; nút xoay có accessible labels; số zoning đã tăng cỡ và legend riêng.

## Visual QA và ba vòng critique

Chụp thật 17 trang ở **375, 390, 768, 1280, 1440, 1920px**, thêm WebGL hero/viewer, form errors và no-results. Lazy images được kích hoạt và decode trước khi chụp. File tại `qa/project-screenshots/`; screenshot không dùng làm UI của sản phẩm. Enquiry đã điền trong ảnh là fixture QA, không phải lead thật.

Vòng tự soát: sửa hidden-state cascade làm lộ toast rỗng; tăng chữ phụ tối thiểu 12px; tăng vùng bấm navigation; đổi sơ đồ thành bốn bố trí riêng và làm rõ nét/legend; mobile đưa review panel trước cột bổ sung; thu gọn header enquiry; thêm ảnh nội thất đúng công năng, responsive srcset và eager ảnh đầu danh mục; sửa wording Save/Remove và Reduce detail.

Vòng theo vai trò: người xem mobile cần thấy CTA và hiểu loại không gian; người kiểm accessibility cần nhãn khớp chữ hiển thị, native dialogs và focus; chủ design system cần shared shell, card, field, tokens và hành vi nhất quán. Lỗi label-content-name mismatch do checker workspace tìm ra đã được sửa và đưa `wcag21a` vào regression.

Vòng độc lập: fresh-session agents chỉ xem packet ảnh/brief/rubric, không đọc source hoặc điểm tự chấm. Packet đầu: **4.07/5**, min **3.5**. Packet sau tìm ra HF-3 do toast che copy; đã thay thành phản hồi inline tại component. Một packet khác tìm ra nhãn Still perspective giao với caption đứng; đã tách vị trí. Đồng thời thay hai ảnh sai công năng, làm rõ Remove/Reduce detail, chỉnh framing mobile và render hero alpha để fallback giữ wordmark. Packet cuối đạt **4.15/5**, min **3.6**, 0 hard fail nhìn thấy; verifier đạt L. Kết quả được lưu trong `docs/independent-review.json`; không tự nâng điểm sau sửa. Đây là **agent-heuristic**, chưa có human approval hoặc nghiên cứu người dùng.

| Dấu hiệu soát ảnh | Kết luận | Vị trí / vai trò |
| --- | --- | --- |
| AI-01 Neon/high-chroma cạnh tranh | not present | Toàn bộ page family; navy/white và amber tiết chế |
| AI-02 Dark + glow trang trí | clearly purposeful | Dark là brand brief; ánh sáng nằm trong kiến trúc, không aurora/glow UI |
| AI-03 Emoji thay icon | not present | Dùng chữ/ký hiệu đơn sắc, accessible names cho actions |
| AI-04 Gradient tím mặc định | not present | Không gradient UI; ảnh thật giữ màu gốc |
| AI-05 Card/card lồng | clearly purposeful | Space cards để chọn/so sánh; dùng grid, typography và hairline, không card bo lồng nhau |
| AI-06 Thanh màu trái nhiều block | not present | Enquiry dùng tiến trình ngang; không rainbow left bars |
| AI-07 Status dot không nguồn | not present | Không online/availability dot; dùng status text từ runtime thật |

## Performance

| Trang / chế độ | Performance | Accessibility | LCP | TBT | CLS |
| --- | ---: | ---: | --- | --- | --- |
| home / mobile | 93 | 100 | 3.2 s | 10 ms | 0 |
| home / desktop | 100 | 100 | 0.6 s | 10 ms | 0.042 |
| spaces / mobile | 96 | 100 | 2.8 s | 0 ms | 0.001 |
| spaces / desktop | 100 | 100 | 0.6 s | 0 ms | 0.002 |

Lượt đo ở source `11ffdfe`; sau đó chỉ đổi chỉ báo accordion và copy Privacy. Best Practices và SEO đều 100 ở bốn lượt. Điểm dao động theo điều kiện lab, không suy từ đó thành field CWV tốt.

Lighthouse 13.6.0, Chrome 156 headless, production HTTP local. Mobile/desktop và các route chạy **lần lượt**, không browser QA khác trong lúc đo. Mobile giữ still trước khi yêu cầu 3D; desktop tự tải hero. Đây là hành vi sản phẩm, không chế độ riêng cho benchmark.

Số đo cuối được trích từ JSON gốc vào `docs/qa-summary.json`: Home và Spaces, mobile/desktop, Performance/Accessibility/Best Practices/SEO và LCP/TBT/CLS. Không dùng các điểm 99/100 từ bản landing cũ cho bản này. Báo cáo HTML/JSON nằm trong QA archive. Điểm lab không chứng minh Core Web Vitals/INP ở người dùng thật; mobile LCP vẫn cần theo dõi khi có hosting và dữ liệu field.

Vite cảnh báo chunk Three.js >500 KB minified. Chunk đã lazy-split (~157 KB gzip), application JS ~11 KB gzip, DPR giới hạn, render dừng khi idle/ngoài viewport/tab ẩn, scene có cleanup. Không tăng ngưỡng để giấu cảnh báo. Ảnh thật có WebP 640/960/full, chọn theo layout/DPR, self-host; không tải ảnh stock từ bên ngoài ở runtime.

## Những phần chưa xác minh / chưa kết nối

- **UNKNOWN:** thiết bị iOS/Android thật, Safari/Firefox, screen reader thủ công, browser zoom/text-only 200% và field CWV. Reflow 320px đã kiểm riêng, không gọi đó là thử text-only zoom.
- **CHƯA CÓ:** inbox xác thực, dịch vụ gửi enquiry, CRM, booking, vị trí, diện tích/giá/availability và model kiến trúc sản xuất. Không mô phỏng thành công các dịch vụ này.
- Mô hình 3D hiện là architectural reference được cấp phép; không phải công trình thực hoặc thiết kế độc quyền LAVA. Zoning sáu tầng là đề xuất riêng.
- Chế độ mailto chỉ xuất hiện nếu có `VITE_CONTACT_EMAIL` hợp lệ; chưa có inbox thật nên không xác minh giao thư end-to-end.
- Production host phải cấu hình trailing slash, index theo thư mục và error document 404. Static `/Lava/` đã kiểm browser; chưa có public deployment.
- CI/PR theo SHA mới nhất, không dùng kết quả của commit trước để tự nhận HEAD xanh. Không merge main trong lần bàn giao này.
