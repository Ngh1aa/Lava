# Duyệt hướng trang chủ

Trạng thái: `CHƯA DUYỆT`. Các trang còn lại dừng cho tới khi chủ repo chọn.

Ba hướng dùng cùng nội dung và hành vi, chỉ khác thứ bậc, mật độ và giọng thị giác.

| Hướng | Cách làm | Mạnh | Đánh đổi |
|---|---|---|---|
| A Bảng giá (`huong-a.html`) | Nền trắng, Bricolage Grotesque, danh sách dạng bảng | So giá và diện tích nhanh nhất, gọn nhất | Ảnh nhà nhỏ trong danh sách |
| B Ảnh trước (`huong-b.html`) | Nền đen, Archivo hẹp in hoa, ảnh lớn đặt lệch | Ấn tượng nhất, ảnh làm nhân vật chính | Trang dài, phụ thuộc chất lượng ảnh thật |
| C Khối màu (`huong-c.html`) | Mảng lava, Be Vietnam Pro, tìm kiếm bằng một câu | Dễ nhớ nhất, thân thiện nhất | Màu mạnh, cần tiết chế ở các trang dài |

Đề xuất: **A**, vì việc chính của người tìm nhà là so nhiều căn. Lấy ô tìm bằng câu của C nếu muốn thêm dấu ấn.

## Kiểm tra

- `taste-check --layout strict --reflow` ở 390 và 1280 px: 0 lỗi cả ba hướng. Cảnh báo còn lại ở B và C là tiêu đề xuống dòng có chủ đích và dòng địa chỉ; đã xem.
- Luồng tự động ở 390 và 1280 px: lọc, trạng thái rỗng, xóa lọc, chọn khu vực, mở đúng căn, chọn sẵn căn khi đặt lịch, khoá nút khi thiếu dữ liệu, lỗi số điện thoại, màn kết quả, đặt thêm lịch, menu điện thoại.
- `UNKNOWN`: axe-core chưa chạy; chế độ tối không áp dụng; chưa thử trên thiết bị thật.

## Giới hạn

- Nhà, giá, địa chỉ là dữ liệu giữ chỗ.
- Đặt lịch chỉ mô phỏng trên trình duyệt, chưa gửi đi đâu.

## Nguồn

- Ảnh: Unsplash, giấy phép Unsplash, tên tác giả `CHƯA CÓ`. Mã ảnh: nha-vuon 1600585154340-be6161a56a0c; nha-toi 1600585154526-990dced4db0d; biet-thu-ho-boi 1613490493576-7fde63acd811; nha-pho 1600047509807-ba8f99d2cdde; chung-cu 1545324418-cc1a3fa10c00; can-ho-ngoai 1460317442991-0ec209397118; phong-khach 1600607687939-ce8a6c25118c; phong-ngu 1600607687644-c7171b42498f; can-ho-nho 1522708323590-d24dbb6b0267; bep 1484154218962-a197022b5858; thap 1486406146926-c627a92ad1ab; nha-doc 1600573472592-401b489a3cdc; nha-trang 1580587771525-78b9dba3b914.
- Chữ: Archivo, Bricolage Grotesque, Be Vietnam Pro (SIL OFL 1.1, xem `assets/fonts/`).
