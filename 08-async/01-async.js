// console.log("Khách A: Cho 1 ly matcha siêu phức tạp");

// console.log("Nhân viên: OK anh ei, vui lòng đứng đợi TẠI QUẦY");

// //tác vụ nặng cahyj đồng bộ *đóng bang hệ thống

// let thoiGianBatDau = Date.now();

// while (Date.now() - thoiGianBatDau < 3000) {
//   //BLOCKING - CPU BỊ NHỐT TRONG VÒNG LẶP NÀY
//   //TRONG SUỐT 3 giây
//   //1.JS sẽ bị mù và điếc vs thé giới bên ngoài
//   //2. KO 1 dòng code nào khác đc chạy
// }

// //phải chờ 3s sau, khi vòng lặp kết thúc, các dòng lệnh bên dướ mới đc chạy

// console.log("NHÂN VIÊN: Matcha xong rồi a ei");

// console.log("KHÁCH B. PHù.... Giờ mới tới lượt mình");

// //vì vongf lặp while -> 1 lệnh đồng bộ  Main Thread(nhân viên) bị nhốt vào trong vòng lặp và phải vắt
// // kiệt sức lực của CPU để kiểm tra điều kiện liên tục trong 3s

// function taoBienLai(thanhCong) {
//   return new Promise((resolve, reject) => {
//     if (thanhCong) {
//       resolve("Đã pha matcha xong");
//     } else {
//       reject(new Error(" hết matcha"));
//     }
//   });
// }

// taoBienLai(true).then((ketQua) => {
//   console.log(".Then nhan ", ketQua);
// });

// taoBienLai(false).catch((loi) => {
//   console.log(".catch nhan", loi);
// });

function datHangOnline(maDon, conHang) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (conHang) {
        resolve({
          maDon: maDon,
          sanPham: "Matcha",
          tongTien: 40000,
        });
      } else {
        reject(new Error(`Đơn ${maDon}: sản phẩm đã hết hàng`));
      }
    }, 5000);
  });
}

console.log("1. Gửi Yêu cầu đặt hàng");

datHangOnline("SP001", true)
  .then((donHang) => {
    console.log("3. then() Nhận đơn hàng", donHang);
    return donHang.maDon;
  })
  .then((maDon) => {
    console.log("4. Chuyển sang bước thanh toán cho mã đơn", maDon);
  })
  .catch((loi) => {
    console.log("Không chạy vào đây vì SP001 thành công", loi.message);
  });

console.log("2. Code dưới này vẫn chạy ngon, không chờ Promise song");

datHangOnline("SP002", false)
  .then((donHang) => {
    console.log("Không chạy vào đây vfi SP002 thất bại", donHang);
  })
  .catch((loi) => {
    console.log("5. Catch bắt lỗi", loi.message);
  });
