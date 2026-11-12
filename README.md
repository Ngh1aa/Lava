# Lava

Landing page tiếng Anh cho dự án căn hộ thấp tầng cạnh biển Lava. HTML/CSS/JS thuần, không cần build.
Font Archivo, có chuyển động khi cuộn (tắt theo cài đặt giảm chuyển động).
Thiết kế theo quy trình của [uiux-ai-workspace](https://github.com/Ngh1aa/uiux-ai-workspace), lấy cấu trúc
trang tham khảo từ residences.loamhouse.com.au.

## Xem

Mở `index.html` trong trình duyệt, hoặc chạy một server tĩnh:

```sh
npx serve .
```

## Cấu trúc

| Đường dẫn | Là gì |
|---|---|
| `index.html` | Trang chính: hero, brochure, 01 Project, 02 Residences, 03 Storage, 04 Materials, 05 Amenities, 06 Location, 07 Contact |
| `legal.html` | Privacy policy và terms |
| `css/tokens.css`, `css/components.css` | Token và component từ design system của uiux-ai-workspace |
| `css/brand.css` | Lớp thương hiệu Lava: màu, bo góc, font (sáng và tối) |
| `css/lava.css` | Bố cục và dấu ấn riêng của trang |
| `js/lava.js` | Chuyển động, menu, tab loại căn, mặt bằng tiện ích, form brochure, form đăng ký 3 bước |
| `tests/flow.test.cjs` | Kiểm luồng bằng Playwright |
| `docs/BRAND-BRIEF.md` | Brand brief (mức D, chưa duyệt) |
| `docs/DESIGN-NOTES.md` | Kế hoạch thị giác, kết quả soát, dữ liệu mẫu, nguồn ảnh, việc còn lại |

## Kiểm

```sh
# cần Playwright: npm i -D playwright && npx playwright install chromium
node tests/flow.test.cjs
```

Gửi form hiện là **mô phỏng**, chưa có backend. Số liệu, giá, tên người trên trang là dữ liệu mẫu.
