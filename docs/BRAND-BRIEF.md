# LAVA — Brand brief

Trạng thái hướng thị giác: **CHƯA DUYỆT**. Chủ dự án cho phép tiếp tục với hướng đề xuất.

Cập nhật 04/11/2026: website gồm 17 trang và luồng chọn không gian → saved → enquiry → review → chuẩn bị chia sẻ. Các dòng mô tả luồng một trang ở cuối brief là lịch sử thiết kế ban đầu; bản đồ màn, sessionStorage, hành vi và trạng thái hiện hành nằm trong [PROJECT-EXPERIENCE.md](PROJECT-EXPERIENCE.md).

- Mức D: chưa có brand assets, dữ liệu công trình, địa chỉ, thông số thương mại hoặc đầu mối liên hệ xác thực. Source ban đầu chỉ có README, commit `3010a6fdc4b52ebe3b299142aca397b0ab204573`.
- Sản phẩm: trải nghiệm kiến trúc trên web; khách quan tâm kiến trúc, đối tác sáng tạo và khách hàng tiềm năng. Audience là HYPOTHESIS từ brief, chưa nghiên cứu người dùng.
- Việc chính: hiểu ý tưởng → khám phá hình khối/không gian → xem gallery → lưu enquiry để gửi qua kênh liên hệ khi được cấu hình.
- Ngôn ngữ website: English; nội dung và cấu hình trong `src/content.ts`. Tài liệu bàn giao tiếng Việt.
- Cảm giác: monumental, quiet, warm. Một công trình xuất hiện từ bóng tối, ánh sáng làm rõ từng lớp không gian.
- Chữ: Manrope tự host, OFL-1.1. Display 64–176px tùy viewport; wordmark tới 29vw; body 17–20px / 1.6. Một họ chữ, không serif, không italic.
- Màu: midnight `#0b1420`, near black `#080e15`, raised `#132130`, text `#f2f1ec`, muted `#b2bbc1`, warm accent `#e9c399`. Ánh sáng màu chỉ nằm trong kiến trúc và hành động có chủ đích.
- Hình khối: góc vuông, hairline, không card trang trí. Desktop 12 cột; tablet 6; mobile 4; lề 20/32/48px.
- Vật gốc: sàn cantilever, nhịp lam đứng và khoảng rỗng giữa các khối. Chọn sàn cantilever để định hình lề lệch và đường phân chia.
- Dấu ấn: wordmark lớn rộng ngang; building procedural với các lớp sàn lệch và lam đồng; camera chuyển giữa ba view và hai thời điểm trong ngày.
- Motion: intro ngắn, reveal theo nhóm, scroll đổi góc camera tiết chế. Không scroll hijack. Reduced motion tắt intro, reveal, parallax và interpolation.
- Không có dự án xây thật, lịch bàn giao, chứng nhận ESG, đối tác, testimonial hoặc con số thương mại được xác thực. Các con số trên màn chỉ đếm tầng/nhịp/khung nhìn đúng với mô hình tạo ra.
- Enquiry không có backend. Mặc định tải bản nháp `.txt` xuống thiết bị, không giả gửi thành công; cấu hình email thật qua biến môi trường khi chủ dự án cung cấp.

## Kế hoạch thị giác theo CRAFT

Vật gốc: sàn công trình cantilever. Hero là sân khấu navy, tên lớn phía trên, building ở giữa, headline/CTA sát lưới trái phía dưới. Mobile chuyển wordmark lên đầu và building vào vùng riêng, CTA luôn thấy trong màn mở đầu.

Một điểm táo bạo: building 3D dưới wordmark khổ lớn. Ba điểm khác starter: không card, bố cục theo mặt cắt kiến trúc, ánh sáng và camera có thể điều khiển. Mật độ thoáng nhưng hình công trình chiếm phần giữa màn. Bảng màu tối do brief yêu cầu, không dùng neon/glass UI. Không dùng icon trang trí.

## Luồng và trạng thái

1. Hero → Explore LAVA → architecture viewer → chọn view/daylight → gallery → enquiry.
2. Menu mở → anchor đúng section → menu đóng và focus về heading; Escape đóng và trả focus.
3. Gallery → ảnh đúng index → trước/sau/keyboard/swipe → đóng và trả focus về thumbnail.
4. Form lỗi → giữ dữ liệu → sửa → tải bản nháp; thông báo rõ file đã tạo, chưa gửi. Không lưu dữ liệu form vào server/localStorage.
5. WebGL lỗi/context lost → static fallback và thông báo; reduced motion/low quality vẫn khám phá được bằng nút.

Các trạng thái áp dụng: loading/ready/fallback; menu closed/open; view selected; gallery closed/open; form empty/invalid/download-ready. Không có login hoặc giao dịch cần xác nhận.

## Cập nhật mô hình — 04/11/2026

Theo yêu cầu tìm mô hình miễn phí, hero/viewer hiện dùng Modern Office Building của CN Entertainment (CC BY 4.0), thay procedural study ban đầu. Giữ ADN navy, editorial type và camera/lighting. Silhouette chuyển sang công trình compact với khung trắng gấp khúc, kính và cladding tối. Chương trình sáu tầng là phương án không gian riêng, không phải cấu trúc đã xác minh của model tham khảo. Nguồn và sửa đổi: [ASSETS.md](ASSETS.md).

## Công trình đã chốt — 05/11/2026

**ĐÃ CHỐT CÔNG TRÌNH:** Axel Springer Campus — OMA, Berlin. Quyết định trực tiếp của chủ dự án; không đồng nghĩa đã duyệt giao diện mới.

LAVA chuyển từ concept đa nguồn sang một trải nghiệm biên tập về công trình này. Giữ brand LAVA / navy / Syncopate Bold, thể hiện rõ tên công trình và OMA. Không trình bày đây là thiết kế do LAVA tạo ra hoặc website chính thức của Axel Springer/OMA.

Trang chủ hướng ngắn 4–5 section: công trình; câu chuyện thiết kế; ba điểm kiến trúc; một lối vào không gian/thư viện; liên hệ. Animation tập trung hero và trang kiến trúc. Bộ lọc mặt bằng, shortlist và enquiry ba bước không còn là trọng tâm của navigation mới.

Nguồn nội dung chính: https://www.oma.com/projects/axel-springer-campus . Các chủ đề có nguồn: atrium đường chéo, các tầng giật cấp tạo không gian làm việc chung, meeting bridge, mái và quan hệ với khu phố. Không gán sáu tầng của concept cũ cho công trình này. Không lấy model Modern Office Building hiện tại để mô tả Axel Springer.

Nguồn ảnh đã kiểm riêng tại Wikimedia Commons (CC BY-SA 4.0):
- Gunnar Klack, ảnh công trình ngày 19/08/2025: https://commons.wikimedia.org/wiki/File:2025-08-19-Axel-Springer-Campus-Berlin-Kreuzberg.jpg
- Lukas Beck, ảnh ngày 10/05/2023: https://commons.wikimedia.org/wiki/File:Berlin_Axel-Springer-Hochhaus_lub_2023-05-10_img02_Neubau.jpg

Bản gốc tải để xem và chuẩn bị tại qa/axel/ (không phát hành lên website). Nếu dùng: ghi tác giả, trang nguồn, CC BY-SA 4.0, thao tác resize/crop; các bản ảnh thích ứng giữ cùng giấy phép. Bộ ảnh Laurian Ghinitoiu / Courtesy OMA trên OMA/ArchDaily chưa được xác minh quyền tái sử dụng cho LAVA, không tải vào source/public. Album nội thất và mô hình 3D đúng công trình: CHƯA XÁC MINH. Giao diện hiện tại chưa được coi là bản triển khai cho công trình đã chốt.

## Quyết định hiện hành — Harpa, 05/11/2026

Chủ dự án đã thay lựa chọn Axel Springer bằng Harpa Concert Hall, Reykjavík. Phần chốt Axel bên trên là lịch sử quyết định, đã được thay thế. LAVA giữ navy / Syncopate / Manrope, chuyển trang chủ thành bốn section. Tòa nhà, Architecture, Spaces và Gallery tập trung một công trình. Dùng sáu ảnh đúng Harpa có giấy phép Pexels/Unsplash. Không gán model văn phòng hoặc zoning sáu tầng cho Harpa. Chưa có model 3D phù hợp được cấp phép nên không đưa viewer giả vào trải nghiệm hiện hành. Brand LAVA là independent architectural study, không giả website chính thức của Harpa.


## Mở rộng biên tập — yêu cầu mới nhất 05/11/2026

Trang chủ dài hơn với bảy section có nội dung hữu ích; thay thế giới hạn bốn section bên trên. Giữ công trình Harpa và nhận diện. Chỉnh chu các trang còn lại bằng cấu trúc editorial, chữ và ảnh cân đối, đường khám phá liên quan, CTA SVG và thông tin thật. Thiết kế mở rộng CHƯA DUYỆT.
