# Lava

Website bán căn hộ thấp tầng cạnh biển Lava, nhiều trang, tiếng Anh. HTML/CSS/JS thuần,
không cần build. Hoạt động như một website bán nhà thật; chỉ thiếu backend.
Font Archivo, có chuyển động khi cuộn (tắt theo cài đặt giảm chuyển động).
Thiết kế theo quy trình của [uiux-ai-workspace](https://github.com/Ngh1aa/uiux-ai-workspace).

## Xem

Chạy một server tĩnh (sessionStorage cần origin thật, không mở bằng `file://`):

```sh
py -3 -m http.server 8000 --bind 127.0.0.1
```

## Trang và luồng

| Trang | Là gì |
|---|---|
| `index.html` | Trang chủ: hero, brochure, các chương 01–07, form đăng ký 3 bước (lưu lại, có mã tham chiếu) |
| `residences.html` | 11 căn: lọc loại, số phòng ngủ, khoảng giá, tình trạng; sắp xếp; đếm kết quả; trạng thái rỗng; đặt lại. Bộ lọc nằm trong URL |
| `residence.html?id=…` | Một template cho mọi căn: thư viện ảnh, thông số, mặt bằng SVG sinh từ dữ liệu, giá, trạng thái, Đặt lịch xem, Lưu, căn tương tự; id sai thì báo không tìm thấy |
| `shortlist.html` | So sánh các căn đã lưu cạnh nhau; xoá (có Hoàn tác), xoá hết (có xác nhận), đặt lịch xem cho cả nhóm |
| `book.html` | Đặt lịch xem 4 bước: chọn căn (tối đa 3), ngày và giờ (giờ đã kín bị khoá), thông tin (kiểm tra ngay khi nhập), xem lại, xác nhận có mã `LV-XXXXXX`. `?reschedule=REF` để đổi giờ |
| `viewings.html` | Lịch xem của tôi: đổi giờ, huỷ (có hộp xác nhận), đặt lại lịch đã huỷ |
| `location.html` | Bản đồ khu vực tương tác, thời gian di chuyển, cách đến |
| `developer.html` | Chủ đầu tư, tiến độ xây dựng, đội dự án |
| `legal.html` | Privacy, terms, nguồn ảnh và font |

## Dữ liệu: chỉ sessionStorage

Không có server. Mọi thứ người xem tạo ra (danh sách lưu, lịch xem, yêu cầu/brochure) nằm trong
`sessionStorage` khoá `lava.v1` (bản nháp đặt lịch ở `lava.draft.book`). Giữ khi chuyển trang trong cùng tab,
mất khi đóng tab. Gửi là mô phỏng qua `Lava.send()` (700–900 ms, mất mạng thì báo lỗi và giữ dữ liệu);
màn xác nhận viết như sản phẩm thật (mã `LV-…`, email và số điện thoại sẽ liên hệ).

**Link cho portfolio:** https://ngh1aa.github.io/Lava/ (mở thẳng trang chủ, không cần đăng nhập).

**Công cụ demo (ẩn với khách):** thêm `?demo=1` vào bất kỳ trang nào, ví dụ
https://ngh1aa.github.io/Lava/?demo=1, để hiện bảng nổi nhỏ "Demo tools" góc dưới trái: **Reset demo data** (xoá hết,
có xác nhận) và **Fail the next request** (lần gửi kế tiếp báo lỗi, để xem trạng thái lỗi). Cờ giữ cho cả tab;
`?demo=0` hoặc nút "Hide demo tools" tắt.

## Cấu trúc

| Đường dẫn | Là gì |
|---|---|
| `js/data.js` | **Dữ liệu mẫu duy nhất**: 11 căn, ảnh, trạng thái, khoảng giá, khung giờ xem |
| `js/app.js` | Lớp chung: kho sessionStorage, định dạng, giờ trống, thẻ căn, toast, hộp xác nhận, số đếm danh sách lưu, `send()`, công cụ demo (`?demo=1`) |
| `js/residences.js`, `residence.js`, `shortlist.js`, `book.js`, `viewings.js`, `location.js` | Mỗi trang một file |
| `js/lava.js` | Chuyển động, header, menu điện thoại, trang chủ (tab, tiện ích, brochure, form đăng ký) |
| `css/tokens.css`, `css/components.css` | Token và component từ design system của uiux-ai-workspace |
| `css/brand.css` | Lớp thương hiệu Lava: màu, bo góc 2 px (cả chip và badge), font |
| `css/lava.css` | Bố cục, các trang con, chuyển động |
| `tests/flow.test.cjs` | Kiểm luồng end-to-end bằng Playwright, tự phục vụ repo |
| `docs/` | Brand brief, ghi chú thiết kế và bàn giao |

Header, menu và footer giống nhau ở mọi trang; sửa thì sửa cả 9 file.

## Kiểm

```sh
# cần Playwright: npm i -D playwright && npx playwright install chromium
node tests/flow.test.cjs
```

Lava là dự án hư cấu: số liệu, giá, tên người, chủ đầu tư và đội dự án đều là dữ liệu tự đặt. Footer mỗi trang ghi "Concept product designed by Đỗ Anh Nghĩa."
