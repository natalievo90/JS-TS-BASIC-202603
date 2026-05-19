1. Bản chất đơn luồng (single-thread) của JS

Nhân viên duy nhất vừa làm thu ngân, vừa làm pha chế Main Thread(luồng chính) của JS.
Multi- threading -> tung ra nhiều nhân viên 1 lúc, để xử lý nhiều việc
nhưgn JS chỉ có thể làm tnwgf việc 1 , dòng này xong mới tới dòng khác

Lập trình đồng bộ (Synchronus)

-> thảm họa: nếu như thằng khách đầu tiên mà order 1 cái món cực kfi phức tạp .
-> nhân viên phải cắm mặt vào pha chế -> toàn bộ khách hàng (và cả cái quán)-> bị khóa chăt (blocked) -> ko ai đc phụ vụ ko ai đc trả loiuwf

Trong automation, thao tác nặng nhất khiến máy tính phải tốn hàng giây đồng hồ xử lý ko phải tính toán
mà là các tác vụ I/O (Input/output - giao tiếp với thế giới bên ngoài)

Tại sao gọi LÀ I/O: bởi vì khi làm việc với các tác vụ này CPU ko tự làm -< > mà nó chỉ gửi yêu cầu (output) -> ra bên ogafi rồi ngồi đợi kết quả (input) -> thời gian chờ nằm ngôafi hoàn toàn kiêm soát của CPU - nó phụ thuộc vào tốc độ mạng, tốc độ phản hồi server, .....

Những tác vụ như nào với AT
I/O với file hệ thống
Đoc/ghj file dung lợng lớn ->để lấy data
lưu ảnh chụp màn hình vào report sau khi chạy test
I/O với trình duyệt
click vào 1 nút (page.click()) -> CPU sẽ gửi lệnh click cho trình duyệt, rồi chờ trình duyệt
xử lý sưk kiện, render lại DOM, và phản hồi xong ...

I/O với server (network)
gọi API để tạo dữ liệu (-> phụ thuộc vào server xxwr lý)

kết nối db -> chờ server trả vêf kết quả query

Nó mới đẻ ra mô hình bất đồng bộ (asynchronus) 


Thay vì thằng cu main thread() phải đứng chờ . JS làm như này

1. Nhân viên nhận order load 1 trang web (tác vụ nặng)
2. Nó ném tác vụ đó ra phía sau cho hệ thống mạng xử lý, đồng thờ phát cho user 1 tờ biên lai (promise)
3. luồng chính lập tức rảnh tay, quay sang phục vụ khách B (chạy tiếp các dòng code bên dưới như đém thời gian, ...etc)

4. Khi web load xong, hệ thống ngầm sẽ "réo tên" cái biên lai (promise) -> để xử lý tiếp 

-. có 3 trạng thái
pending() : mìnhvuawf cầm tờ biên lai. hệ thống mang đi chạy ngầm để tải trang web -> lúc này chưa có dữ liẹu
fulfilled/Resolved (thành công) -> trang web tải xong 100%
rejected . rớt mạng (timeout) -> lúc này tờ biên lai bị huyển kèm theo lỗi



để có thể lấy được thông tin từ promise chúng ta dùng 2 phương thức ghép nối 
.then(callback): sẽ tự động kích hoạt nếu promise thành công (resolved) (dùng để lấy dữ liệu làm bc tíêp)
.catch(callback) sẽ tư động kích hoạt nếu promise thất bại

syntax


const tenPromise = new Promise((resolve, reject) =>{

      //làm việc bấtg đồng bộ ở đây
      nếu thành công
      resolved(giaTriThanhCong)

      nếu thất bại
      reject(lyDoLoi)

})


