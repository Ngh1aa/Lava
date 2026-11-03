# QA và bàn giao LAVA

Ngày kiểm: 03/11/2026. Trạng thái hướng thiết kế: **CHƯA DUYỆT bởi người dùng**. Review agent không thay thế việc phê duyệt.

## Cập nhật ảnh thật — 03/11/2026

Theo yêu cầu mới, thay ba ảnh AI và ảnh model trong Gallery bằng bốn ảnh chụp Unsplash có nguồn/tác giả/giấy phép được đối chiếu trong ASSETS.md. Ảnh được nén WebP và phục vụ local. Spaces ghi Photo reference và credit; lightbox cập nhật đúng tác giả/link theo ảnh. Hero và fallback WebGL vẫn dùng model gốc.

Build/typecheck, lint, token/contrast và **11/11 browser tests PASS** sau thay ảnh; test gallery có thêm đối chiếu credit/link và vẫn kiểm keyboard/swipe/focus. Ảnh render Spaces/Gallery được chụp lại ở sáu viewport yêu cầu. Các điểm Lighthouse và review độc lập bên dưới thuộc mốc bàn giao trước thay ảnh, không phải phép đo/chấm điểm lại cho bộ ảnh Unsplash.

## Source và chạy thử

- Repository: [Ngh1aa/Lava](https://github.com/Ngh1aa/Lava).
- Branch: `feat/lava-architectural-experience`.
- PR: [#1](https://github.com/Ngh1aa/Lava/pull/1), về main; không tự merge.
- Mốc implementation: `553e17197aec1d2b62a12814b1459719047bd9dc`.
- Mốc polish: `2030df2` (controls, responsive, stable GPU tests và camera theo thời gian).
- Dev local: `http://127.0.0.1:5173/`; production preview: `http://127.0.0.1:4173/` khi server tương ứng đang chạy. Không có deployment production được xác nhận.

## Kết quả kiểm tra

| Hạng mục | Trạng thái | Bằng chứng / phạm vi |
| --- | --- | --- |
| TypeScript | PASS | `npm run build` chạy `tsc --noEmit`, TypeScript strict; thêm `npm run typecheck` để chạy riêng |
| Lint | PASS | `npm run lint` |
| Production build | PASS | Vite build, HTML dựng sẵn và assets local |
| Design tokens | PASS | `npm run check:design`: 53 tokens, 20 cặp contrast, resolve alias, kiểm token dùng trong CSS, không `!important` và màu UI không rải vào component CSS |
| Browser regression | PASS | 11 Playwright tests, Chrome headless trên Windows; không có unit test vì logic cần kiểm chủ yếu nằm trong browser |
| Responsive | PASS trong phạm vi đo | 320/375/390/768/1280/1440/1920px không document overflow; sáu kích thước yêu cầu có screenshot full page và hero; thêm 375×667, 390×740, 1280×720 và 1920×1000 kiểm CTA và wordmark |
| 3D thật | PASS | Constructor WebGL, canvas hiển thị, đổi perspective làm thay đổi pixels, Dusk/Daylight, Low power và nút xoay |
| Touch 3D / gallery | PASS trong emulation | Coarse pointer bắt đầu bằng still; bật WebGL theo yêu cầu, Still view dispose canvas; CDP touch swipe chuyển đúng ảnh |
| Menu / focus | PASS | Mở/đóng bằng nút và Escape, anchor đúng đích, focus về heading; lightbox đóng trả focus về ảnh gốc |
| Enquiry mặc định | PASS | Nhập thiếu/sai → lỗi cụ thể → sửa giữ dữ liệu → file chứa đúng nội dung; không POST hay báo đã gửi |
| Keyboard | PASS trong luồng đã kiểm | Tab, Escape, gallery trái/phải; tablist trái/phải/Home/End; skip link focus được |
| Reduced motion | PASS | Không intro/reveal/parallax, shader camera cập nhật trực tiếp; tắt transition của canvas/ảnh; axe chạy trên các state ổn định này |
| WebGL fallback | PASS | Thử constructor thất bại, `?view=still`, context-lost; ảnh và nội dung còn dùng được, controls không khả dụng được khóa |
| Không JavaScript | PASS | Nội dung đã có trong HTML, ảnh mở bằng link thật, form submit bị khóa để không đưa dữ liệu vào URL |
| Runtime / assets | PASS trong test | Không page exception hay HTTP >=400 ở viewport checks; ảnh lazy được kích hoạt trước khi capture |
| axe WCAG A/AA | PASS trong phạm vi audit | Desktop, mobile menu, form lỗi và gallery; không có violations. Không tương đương chứng nhận WCAG toàn bộ sản phẩm |
| UIUX `static-check` | PASS | 0 lỗi trên `dist/index.html` |
| UIUX `taste-check` | PASS về lỗi tự động | 390/768/1280/1440, sáng/tối theo OS, 320px reflow, `--layout strict`; cảnh báo được xử lý theo nhóm dưới đây |
| UIUX `flow-check` | PASS phần tĩnh; runtime UNKNOWN trong checker | Không có lỗi chắc chắn. Các handler runtime được đối chiếu bằng 11 browser tests; no-entry của overview/experience là section đọc qua scroll, không phải route thiếu |
| Review ảnh độc lập | PASS ngưỡng rubric ở packet vòng 2 | Fresh agent chỉ đọc ảnh/brief/rubric: 4.05/5, không hard fail nhìn thấy, min 3.5, chiều consistency 4. Verifier xác nhận packet hợp lệ |
| Runtime dependency audit | PASS tại thời điểm kiểm | `npm audit --omit=dev`: 0 vulnerability |

## Lighthouse trên production build local

Đo bằng Lighthouse 13.6.0, Chrome headless 156, qua HTTP local, mobile/desktop chạy lần lượt. Không chạy browser QA khác trong lúc đo. Mobile emulation có coarse pointer và giữ ảnh still trước khi người dùng yêu cầu 3D; desktop tải hero WebGL tự động. Đây là hành vi sản phẩm, không phải chế độ riêng cho benchmark.

| Chỉ số | Mobile | Desktop |
| --- | ---: | ---: |
| Performance | 99 | 100 |
| Accessibility | 100 | 100 |
| Best Practices | 100 | 100 |
| SEO | 100 | 100 |
| LCP | 2.0 s | 0.4 s |
| TBT | 0 ms | 0 ms |
| CLS | 0 | 0.042 |

Giá trị cụ thể của lượt đo cuối được lưu trong `qa/lighthouse-mobile.json` và `qa/lighthouse-desktop.json`, cùng HTML report. Lần đo đầu trước tối ưu chỉ đạt Performance 63 mobile; đã thay đổi cách tải 3D trên touch, tách chi phí môi trường phản xạ khỏi hero và kiểm lại. Các số lab không chứng minh INP/CWV ngoài thực tế; không có dữ liệu field hay real-device benchmark.

## Checker và các cảnh báo đã review

- `taste-check` còn các heuristic về wordmark sát cạnh, headline chủ đích hai dòng, captions trong track cuộn ngang, body copy sau heading và widow. Không có lỗi contrast, overflow, asset hoặc axe trong lượt PASS. Giữ đoạn mô tả vì đây là nội dung kiến trúc của brief; không xóa nội dung cần thiết chỉ để giảm số cảnh báo. Gallery cắt track theo viewport có scroll/touch/nút thật, không phải document overflow.
- `check-brand.py` của Workspace tự ghép token LAVA với **toàn bộ** design system dashboard gốc. Nó báo 14 cặp dataviz/feedback không dùng trong website, nên không được gọi là PASS. Không thêm token thừa để che các lỗi không áp dụng. Thay vào đó kiểm trực tiếp toàn bộ 20 cặp đang dùng bằng `check:design`, rồi so contrast trên browser với axe/taste-check. `validate.py` của design system Workspace không áp dụng cho CSS system độc lập này.
- Vite cảnh báo scene chunk lớn hơn 500 KB minified. Chunk đã tách riêng, khoảng 136 KB gzip; trên touch chỉ tải khi yêu cầu. Không tăng giới hạn checker để xóa cảnh báo.
- `npm audit` đầy đủ báo 15 moderate ở dependency phát triển liên quan glob/minimatch/ESLint/Lighthouse; runtime audit là 0. Không chạy `audit fix --force` để downgrade/bẻ peer dependency. Không phục vụ dev tooling ra production.

## Review và thay đổi từ bằng chứng

Vòng 1 độc lập: 3.75/5, HF-3 do Skip link xuất hiện che title trong capture mobile. Đổi cách ẩn thành clip ngoài focus, kiểm keyboard, chụp lại. Vòng 2 độc lập: 4.05/5, không hard fail từ ảnh, verifier đạt XL. Hai chiều Interaction và Craft vẫn 3.5; model hiện là architectural study, chưa có mức chi tiết của model kiến trúc sản xuất.

Sau vòng 2: bổ sung cue “Use arrows to rotate”, caption “Concept vision” cho các ảnh Spaces và giữ tên perspective trong viewer. Không tự nâng điểm review sau sửa. Packet review, manifest SHA-256 và JSON gốc giữ trong QA local. Các điểm agent là heuristic, không phải human approval, nghiên cứu người dùng hoặc bằng chứng sử dụng thật.

## GitHub Actions

CI chạy npm ci → lint → token/contrast → build → cài Chromium → 11 browser tests. Lượt đầu trên Ubuntu hoàn thành build/lint và 10/11 tests nhưng test GPU hết budget 30s. Đã chuyển so sánh camera/pixel sang reduced-motion để kiểm state ổn định trên software GPU, giữ nguyên assertions và không bỏ test; runtime camera đồng thời chuyển sang interpolation theo thời gian. Một lượt sau chạm giới hạn assertion mặc định 5s khi compile shader, nên CI dùng loading budget 15s/assertion và 60s/test; local giữ 5s/30s. Không thêm timeout/retry vào application để che lỗi. Kết quả mới cần đối chiếu tại PR theo SHA mới nhất, không dùng kết quả commit trước thay cho commit mới.

**PASS tại source commit `2030df25af009456e1b196bcd634045349420767`**, [GitHub Actions run #2](https://github.com/Ngh1aa/Lava/actions/runs/41587168865). Các commit tài liệu sau đó không thay application source; xem check của HEAD tại PR để biết trạng thái mới nhất.

## UNKNOWN và giới hạn còn lại

- Chưa human/product approval, usability research, screen reader thủ công hoặc real iOS/Android/Safari/Firefox device testing.
- Chưa kiểm việc gửi thư trong email app thật; mặc định chỉ tải file. Không có backend/inbox dự án thực, availability, đơn giá hay dữ liệu thương mại.
- Zoom 200% bằng browser thật / trình đọc màn hình chưa được xác minh đầy đủ. Kiểm 320px reflow và short viewport không được đánh đồng với coverage này.
- Ảnh Unsplash là ảnh tham khảo của các công trình khác, có credit và link gốc; không phải ảnh chụp LAVA hay bằng chứng dự án đã xây dựng.
- Visual model có thể tiếp tục nâng cấp nếu có GLB/BIM hoặc vật liệu/ảnh công trình thật. Đã giữ giới hạn GPU và accessibility thay vì thêm hậu kỳ nặng.
- Không có public deployment hoặc domain được cấu hình; không merge main.

## Artifacts

`qa/screenshots/` chứa các ảnh render thật theo viewport, hai hướng hero, các section chính, fallback và touch-3D. `qa/review/` và `qa/review-2/` giữ hai packet độc lập. `qa/` được gitignore để không đẩy screenshot tham khảo/trace nặng lên source; ảnh tóm tắt của LAVA được lưu ở `docs/previews/`. Báo cáo và ảnh đầy đủ được đóng gói riêng trong output bàn giao local.
