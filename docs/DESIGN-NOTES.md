# Ghi chú thiết kế và bàn giao

## Cập nhật 12/11/2026: tiếng Anh, font Archivo, chuyển động

Theo yêu cầu chủ repo:

- **Ngôn ngữ:** toàn bộ nội dung, nhãn, thông báo lỗi, `alt`, `aria-label` và trang pháp lý chuyển sang
  tiếng Anh (`lang="en"`). `chinh-sach.html` đổi tên thành `legal.html`.
- **Font:** thay Source Serif 4 bằng **Archivo** (variable, trục `wdth` 62–125 và `wght` 100–900, OFL).
  Vẫn một họ chữ theo TASTE: tiêu đề 700–800, giãn 112–125%, hero viết hoa; thân chữ 400, độ rộng thường.
  Cảm giác cứng, vuông vức như chữ trên bản vẽ kết cấu và biển hiệu công trình.
- **Chuyển động** (tắt hết khi bật giảm chuyển động; JS lỗi thì sau 3 giây nội dung tự hiện):
  hero trồi từng dòng sau mặt cắt; ảnh tràn màn trôi chậm (parallax); vạch kẻ trên số chương tự kẻ ra như
  nét vẽ kỹ thuật; tiêu đề lộ qua mặt nạ cắt; ảnh mở từ dưới lên và thu từ phóng to về; số liệu đếm lên;
  thanh thời gian di chuyển dài dần; mặt bằng tự vẽ đường đồng mức, khối nhà hiện, chấm bật lên lần lượt,
  chấm đang chọn có vòng xung nhịp; ảnh loại căn mờ chéo khi đổi tab; header ẩn khi cuộn xuống, hiện khi
  cuộn lên; gạch chân nav kéo dài khi rê chuột.
- Lỗi tìm thấy khi làm và đã sửa: IntersectionObserver của Chromium coi phần tử bị `clip-path` cắt kín là
  diện tích 0 nên tiêu đề và ảnh không bao giờ hiện; nay quan sát phần tử cha. Tiêu đề hero vỡ 4 dòng ở
  1440 px; số "86–240 m²" tràn sang cột bên.
- Soát lại: `taste-check` 390/768/1280/1440 px, sáng và tối, reflow 320 px, axe-core: 0 lỗi.
  `static-check` 0 lỗi, `check-brand` 0 lỗi, `tests/flow.test.cjs` 27/27 PASS.
- Mục bên dưới là bản ghi của lượt đầu (tiếng Việt, Source Serif 4); phần quyết định màu, bố cục, luồng,
  dữ liệu mẫu và nguồn ảnh vẫn đúng.

Cỡ việc: **M** (landing page, web marketing), quy trình theo `START-HERE.md` và `WORKFLOWS.md` của
[uiux-ai-workspace](https://github.com/Ngh1aa/uiux-ai-workspace). Hướng thị giác: **CHƯA DUYỆT**.

## Kế hoạch thị giác (CRAFT.md mục 1)

```text
Ngành và vật gốc:      bất động sản nhà ở cạnh biển; vật gốc đá bazan, đường đồng mức
Một câu cảm giác:      trầm, rộng, chắc như một phiến đá mài
Chữ:                   Source Serif 4; tiêu đề 300, 38–136 px, line-height 1,04–1,1; thân 400, 17–18 / 1,6; nhãn 600; có tiếng Việt: có
Màu theo vai trò:      nền #edeeeb, bề mặt #f8f8f6, chữ #1a1d1c, thương hiệu #2a3532, dải tối #1f2826, không màu nhấn thứ hai
Hình khối:             bo 2 px mọi bề mặt; viền 1 px thay bóng
Bố cục màn chính:      hero ảnh tràn màn, tiêu đề hai dòng, vạch mảnh, giá + hai nút
                       brochure: danh mục 5 cột | form 6 cột
                       chương 01–07: rail số chương (3 cột) | tiêu đề + nội dung (9 cột)
                       dải bazan tối cho Vật liệu, ảnh tràn màn lời mời cuối
Lưới và mật độ:        12 cột từ 1024 px, 4 cột ở 390; thoáng; khoảng section 88–144 px
Card nổi bật:          không dùng; dải Vật liệu là điểm đổi nhịp duy nhất
Một điểm táo bạo:      tiêu đề hero serif mảnh 136 px trên ảnh
Ba điểm khác starter:  1. bo 2 px  2. một họ serif  3. rail số chương + mặt bằng đồng mức
Đã đối chiếu mục 2:    nền kem + đất nung của trang tham khảo → xám đá + bazan; không hero căn giữa;
                       không ba card icon; loại căn dùng tab + bảng thông số thay card
```

## Lấy gì từ trang tham khảo, đổi gì

| Trang tham khảo | Lava | Lý do |
|---|---|---|
| Section đánh số 01–06, nhãn nhỏ phía trên tiêu đề | Rail số chương bên trái; trên điện thoại số đứng cạnh tiêu đề | TASTE cấm overline trên mọi tiêu đề |
| Dòng thứ hai in nghiêng, serif + sans | Một họ Source Serif 4, không in nghiêng | TASTE: một họ chữ, không chèn nghiêng |
| Nền kem, nhấn đất nung | Xám đá vôi, đá bazan | CRAFT cấm bảng màu này; tên Lava gợi đá núi lửa |
| Header trong suốt trên ảnh | Header luôn đặc | Chữ trắng trên phần trời sáng của ảnh không đạt 4,5:1 |
| Chú thích "Artist's impression" trên ảnh | Đưa vào trang Điều khoản | TASTE cấm ghi chú minh hoạ trên màn. **Bản phát hành thật cần xin ý kiến pháp lý**: có thể bắt buộc ghi "phối cảnh minh hoạ" cạnh ảnh |
| Hiện dần khi cuộn (GSAP) | Không dùng | Nội dung phải đọc được khi tắt JS hoặc chụp ảnh |

## Màn hình × trạng thái

| Khối | Trạng thái đã dựng và kiểm |
|---|---|
| Form brochure | mặc định, lỗi trường (trống, email sai, số sai), đang gửi (khoá nút), mất mạng (banner, giữ dữ liệu), đã gửi, sửa email |
| Loại căn | 3 tab, đổi ảnh và thông số; bàn phím (mũi tên, Home, End) |
| Mặt bằng tiện ích | 6 mục; chấm và danh sách đồng bộ |
| Form đăng ký 3 bước | mỗi bước có lỗi; Quay lại giữ dữ liệu; Gọi/Email đổi trường; "Hẹn xem" hiện chọn ngày; đang gửi; mất mạng; kết quả có tóm tắt; Sửa thông tin |
| Điền sẵn | "Hẹn xem nhà mẫu" ở mọi nơi → nhu cầu Hẹn xem; "Hỏi về căn này" → Tư vấn + đúng loại căn |
| Menu điện thoại | mở, Esc đóng, giữ focus trong menu, bấm link thì đóng |

## Kiểm luồng (FLOW.md)

```text
Luồng / đường vào:           PASS  mọi nút chính dẫn tới form thật trên trang; link footer tới chinh-sach.html
Đối tượng / vai trò:         PASS  "Hỏi về căn này" điền đúng loại căn của tab đang mở
Back / giữ bản nháp:         PASS  Quay lại giữ tên, số, email; Sửa thông tin về bước 3 còn lựa chọn
Sửa → xác nhận → kết quả:    PASS  tóm tắt khớp tên, cách liên lạc, nhu cầu + ngày, loại căn
Lỗi → khôi phục:             PASS  mất mạng → banner → gửi lại thành công; nút khoá khi đang gửi
Bằng chứng:                  tests/flow.test.cjs, 27/27 PASS ở 1280 sáng và 390 tối
Phần mô phỏng:               gửi form là giả lập 900 ms, chưa có backend, chưa gửi email thật
Chưa kiểm:                   backend, email/CRM, thiết bị thật, trình đọc màn hình, người dùng thật
```

## Kết quả soát (12/11/2026)

- `check-brand.py css/brand.css`: 0 lỗi.
- `static-check.cjs`: 0 lỗi ở `index.html`, `chinh-sach.html`.
- `taste-check.cjs` ở 390, 768, 1280, 1440 px, sáng và tối, `--reflow` 320 px, có axe-core: **0 lỗi**.
  Còn cảnh báo `subtitle` ở đoạn mở đầu chương 01, mô tả kho và vật liệu, và trang chính sách. Giữ lại vì đó
  là dữ liệu thật (công dụng, diện tích, nơi dùng vật liệu), không phải câu giải thích giao diện.
- Đã nhìn ảnh từng chương ở 1440 px và cả trang ở 390, 1440, sáng và tối. Lỗi tìm thấy khi nhìn ảnh
  (script không bắt được) và đã sửa: danh sách vật liệu bị kéo giãn theo ảnh dọc; ảnh hero không phủ hết
  chiều cao trên điện thoại; ảnh căn sân vườn trùng ảnh hero; tiêu đề bước lặp ý với nhãn ô nhập.
- Test luồng bắt thêm một lỗi thật: `.ds-field { display: flex }` đè thuộc tính `hidden`, làm ô số điện
  thoại và ô chọn ngày không ẩn được. Đã sửa trong `lava.css`.

## Dữ liệu mẫu (không phải thông tin thật)

Mọi con số và tên trên trang là **giả định** để dựng bố cục: 64 căn, 86–240 m², 4 phút tới biển, giá
6,8 / 8,2 / 19,5 tỷ, diện tích từng loại căn, giờ mở tiện ích, thời gian di chuyển, số trang brochure,
tên và số điện thoại hai chuyên viên, địa chỉ "12 đường Ven Biển", ngày xem nhà mẫu (viết cứng từ 14/11/2026).
Phải thay hết bằng dữ liệu của chủ đầu tư trước khi phát hành.

## Ảnh

Ảnh stock **CC0 1.0** từ rawpixel (tìm qua Openverse), bản 1024 px. Đủ để duyệt hướng, nhưng mềm khi tràn
màn 1440 px; bản thật nên thay bằng phối cảnh của chủ đầu tư ở ≥ 2400 px, định dạng AVIF/WebP.

| File | Nội dung | Nguồn |
|---|---|---|
| hero-mat-tien.jpg | Mặt tiền gạch tối, vườn sỏi | rawpixel, "Modern villa, real estate" |
| du-an-san-vuon.jpg | Dãy nhà hai tầng có vườn | rawpixel, 210097_06, public domain |
| can-san-vuon.jpg | Sân lát đá trước nhà | rawpixel, 215074_08, public domain |
| can-tieu-chuan.jpg | Phòng khách tối giản | rawpixel, "Free minimalist living room interior" |
| can-penthouse.jpg | Nhà có hồ bơi | rawpixel, "Free modern house, villa, swimming" |
| luu-tru.jpg | Phòng thay đồ | rawpixel, "Elegant bright walk-in closet" |
| vat-lieu.jpg | Ghế gỗ, sàn bê tông | rawpixel, "Stool Bar Counter" |
| vi-tri-bien.jpg | Bãi biển hoàng hôn | rawpixel, "Tropical beach sunset landscape" |
| mo-ban.jpg | Nhà gạch xám trắng | rawpixel, "Modern house, real estate" |

Font Archivo: SIL OFL 1.1 (`fonts/archivo/OFL.txt`), lấy từ github.com/google/fonts. Token, component và icon chép từ
`design-system/` của uiux-ai-workspace.

## Việc còn lại để phát hành

1. Chủ repo duyệt hướng (màu, font, hai chỗ lệch khỏi trang tham khảo nêu trên).
2. Logo, ảnh phối cảnh, dữ liệu dự án thật; câu chú thích pháp lý cho ảnh phối cảnh.
3. Backend cho hai form (email brochure, CRM), chống spam, thông báo đồng ý xử lý dữ liệu cá nhân.
4. Subset font sang woff2 (hiện TTF ~1,2 MB); tối ưu ảnh.
5. Kiểm trên thiết bị thật và với trình đọc màn hình.
