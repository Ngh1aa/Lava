# Design direction và nguồn tham khảo

> Phần phân tích dưới đây ghi lại lần dựng nhận diện và hero đầu tiên. Từ ngày 04/11/2026, kiến trúc website đã được mở rộng thành 17 trang. Xem [PROJECT-EXPERIENCE.md](PROJECT-EXPERIENCE.md) cho audit brownfield, flow và quyết định hiện hành. Hai hướng hero là bằng chứng nghiên cứu, không còn là query thử nghiệm trong sản phẩm.

## Audit

LAVA được clone từ `Ngh1aa/Lava`, clean tree, nhánh mặc định main, commit khởi tạo `3010a6f`. Không có framework, assets, tests, deployment hoặc UI cần redesign. Không áp dụng brownfield. Vite + TypeScript + Three.js phù hợp trải nghiệm tĩnh này, không cần React hoặc GSAP.

UIUX AI Workspace: main tại `5404c183e2e6d09261ddb97b238e09ab56bd5a8a`. Chỉ đọc, không sửa. Đường đọc START-HERE → AGENTS → WORKFLOWS → TASTE → CRAFT → FLOW → BRAND-BRIEF; track XL vì chưa có design system, giới hạn vào website một trang.

Skills ADOPTED: visual-design-direction (hai hero cùng nội dung), ui-craft-and-visual-qa (render và state QA), design-reference-research-and-benchmark (evidence tách suy luận), responsive-and-device-strategy (mobile recompose), design-system-and-components (semantic tokens), design-critique-and-rationale (ba vòng review), ux-structure-and-flow-design, information-architecture, audience-intent-and-top-tasks, experience-principles-and-signature-moments, industry-playbooks/real-estate-and-building-website.

Codex skills: design-taste-frontend, sites (local preview, source theo repository do user chỉ định), ui-craft-and-visual-qa, imagegen. Engineering: Three.js procedural, native IntersectionObserver/rAF, Playwright, axe-core, ESLint, TypeScript, Lighthouse. Không có skill Three.js/Playwright chuyên biệt trong catalog; dùng API và docs chính thức.

## Nguồn tham khảo

- [Likova](https://likova.space/): quan sát trực tiếp qua Chrome/Playwright desktop/mobile. Web text fetch ban đầu lỗi; browser truy cập được. Ảnh tham khảo chỉ lưu trong QA không commit, không sử dụng làm asset.
- [Case study gốc Vide Infra](https://videinfra.com/blog/likova-commercial-real-estate-website-design): dùng hình học công trình làm ngôn ngữ, phối hợp render và UI, 3D phục vụ khám phá. ADAPT nguyên tắc; REJECT sao chép asset, TT Norms Pro, code hay số liệu của Likova.
- [Three.js docs](https://threejs.org/docs/), [Vite docs](https://vite.dev/guide/): đối chiếu API với version lockfile.

### Quan sát trực tiếp

Desktop mở bằng navigation rất gọn trên nền trắng, wordmark lớn nằm trong mép khối có bậc, công trình trên nền trời tối chiếm trung tâm. Một khung hình phối hợp mảng trắng, nền navy và ánh sáng mặt đứng. Các section tiếp theo chia theo số thứ tự, tiêu đề uppercase và số liệu khổ lớn; công trình tiếp tục làm đối tượng dẫn chuyện thay vì card tính năng.

Menu nhóm About, Location, Master plan, Architecture, Lobby, Offices, Technology, Infrastructure và Team; tác vụ thương mại riêng gồm chọn văn phòng theo thông số hoặc bằng visual selector. Đã mở `/en/visual-selector`: hành trình bắt đầu từ chọn tầng với mô hình công trình, thay vì một form dài. LAVA áp dụng việc dùng một đối tượng trực quan làm điểm vào, không dựng bộ chọn văn phòng vì không có tồn kho hay mặt bằng thực.

Typography là grotesk khỏe, chênh lệch scale lớn, lề sát lưới và nhiều khoảng thở. Desktop hero có chữ/ảnh chia tầng và bậc, mobile tái bố trí wordmark/công trình theo trục dọc. Scroll tiết lộ ý tưởng, thông số, vị trí, các khía cạnh kiến trúc rồi chi tiết không gian. Quan sát hai vị trí scroll và hero ở mobile; không coi ảnh tĩnh là bằng chứng mọi animation.

Các lựa chọn ADAPT: silhouette và vật liệu làm ngôn ngữ, một font, ánh sáng trong kiến trúc thay accent trang trí, progression từ toàn thể tới chi tiết, có tác vụ rõ khi rời phần kể chuyện. LAVA dùng công trình terraced riêng, nền tối thống nhất và quy tắc camera/scroll riêng. REJECT: copying bậc layout từng pixel, font/logo/asset/code, địa chỉ, con số thương mại, contact hoặc claim của Likova.

Không đo performance, bộ nhớ GPU hoặc coverage thiết bị của Likova; các nhận định về cách tối ưu nội bộ là UNKNOWN. Không có quyền dùng 3D model của họ và không tải model đó vào LAVA.

## Hai hướng hero cùng nội dung

**A / Monument after dark — đề xuất:** wordmark cực lớn ngang phía trên, công trình nổi giữa sân khấu tối, headline nhỏ hơn và CTA ở dưới trái. Công trình là trọng tâm, navigation vẫn gọn. Rủi ro: cần kiểm wordmark/công trình không che headline ở màn thấp.

**B / Architectural index:** wordmark thu nhỏ trong cột trái, headline cực lớn thành hai dòng phía trên; building lệch phải, index dọc. Dễ đọc lời hứa hơn nhưng nhấn typography nhiều hơn đối tượng kiến trúc, ít phù hợp signature hero của brief.

Hai hướng được dựng thật qua `?direction=b` và capture cùng viewport; biến thể là công cụ duyệt hướng, không nằm trong navigation. Chọn A để phát triển do ưu tiên building và nhận diện. Trạng thái **CHƯA DUYỆT**, đây là lựa chọn agent theo quyền tự tiếp tục trong brief.

## Nhịp trang

Hero sân khấu → statement chữ lớn → overview số đếm mô hình → architecture viewer khung rộng → spaces ảnh/cột lệch → experience accordion → gallery filmstrip → enquiry cột form → footer wordmark. Không lặp heading + ba card. Navbar và anchor phục vụ một hành trình; không dựng trang con không có nội dung thật.

## Các vòng critique

1. Tự soát render: sửa nền ground che wordmark, tràn stage mobile, framing chữ ở 1920px, caption và độ rõ của lam/ánh sáng. Sau đó kiểm sáu kích thước riêng; bổ sung 375×667 và 1280×720 để kiểm CTA trong màn thấp.
2. Theo vai trò: người xem lần đầu cần thấy Explore LAVA; touch cần bật/tắt 3D rõ; accessibility cần native dialog/focus/keyboard và enquiry không gửi nhầm; chủ design system cần semantic tokens và một họ chữ. Camera chuyển sang interpolation theo thời gian để không kéo dài animation trên GPU chậm.
3. Hai fresh-session agents chỉ nhận ảnh, brief và rubric qua review packet. Vòng đầu 3.75/5, HF-3 từ Skip link hiện trong ảnh mobile; thay cách ẩn offscreen bằng clipping ngoài trạng thái focus và chụp lại. Vòng hai 4.05/5, không hard fail nhìn thấy, chiều 6 = 4; packet verifier xác nhận đạt ngưỡng XL. Interaction và Craft vẫn 3.5, cần tiếp tục polish khi có model sản xuất thực. Sau đó bổ sung cue xoay bằng nút và nhãn Concept vision; không tự tăng điểm review sau các chỉnh sửa này.

Đây là **agent-heuristic**, không phải nghiên cứu người dùng hay duyệt của chủ dự án. Hướng vẫn **CHƯA DUYỆT**. Ảnh không chứng minh screen reader, motion hay backend; bằng chứng hành vi nằm riêng trong browser tests và QA.

## Cập nhật asset theo yêu cầu — 04/11/2026

Procedural study ở các vòng thiết kế đầu đã được thay bằng GLB Modern Office Building / CN Entertainment / CC BY 4.0. Dùng GLTFLoader có sẵn trong Three.js, không thêm dependency; chỉnh framing, kính và ánh sáng, render lại still desktop/mobile cùng ba góc nhìn. Thông tin vật liệu và nội dung viewer được đổi theo model mới; không nhận công trình của tác giả là nguyên bản LAVA. Các điểm review độc lập phía trên thuộc bộ ảnh trước thay model, không dùng làm điểm chất lượng của phiên bản GLB. Lượt mới được kiểm qua browser, ảnh render và Lighthouse, không tự chấm điểm hay gọi là đã duyệt.
