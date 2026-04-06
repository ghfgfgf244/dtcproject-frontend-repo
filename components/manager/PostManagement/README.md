# Post Management Components

## Cấu trúc

### PostCompactList
Component hiển thị danh sách rút gọn các bài post với:
- Tiêu đề bài viết
- Ngày tạo
- Nút toggle trạng thái (hiển thị/ẩn)
- Nút xem chi tiết

### PostFilterPanel
Component bộ lọc bên phải với các tùy chọn:
- Tìm kiếm theo tên (tiêu đề)
- Lọc theo ngày cập nhật (từ ngày - đến ngày)
- Lọc theo category (danh mục)
- Nút reset để xóa tất cả filter

### PostClientView
Component quản lý bài viết dạng bảng (table view) - sử dụng cho trang quản lý chi tiết

## Sử dụng

Trang `/enrollment-manager/posts` sử dụng layout:
- Bên trái: CreatePost + PostCompactList
- Bên phải: PostFilterPanel

Layout này tương tự như trang `/homepage` của user nhưng có thêm filter và hiển thị dạng compact.
