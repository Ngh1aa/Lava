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
