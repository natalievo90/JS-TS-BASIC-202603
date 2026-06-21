// ============================================================
// Kết quả kiểm tra:
//   - Khi gắn thêm bộ dữ liệu test của đề và gọi tinhTienGioHang(donHang1/donHang2), Bài 1 chạy đúng logic chính.
//   - File hiện chỉ có Bài 1, chưa thấy phần Bài 2 Promise.allSettled.
// ============================================================

//## Bài 1: Tính tiền giỏ hàng Neko Shop
// ----- HÀM XỬ LÝ CHUỖI -----
// Đúng: Hàm chuanHoaTen xử lý đủ các bước chính:
//       trim() bỏ khoảng trắng hai đầu, toLowerCase() đưa về chữ thường,
//       split/filter/map/join để viết hoa chữ cái đầu từng từ.
//       Case "  áo thun " -> "Áo Thun", "MŨ" -> "Mũ" chạy đúng.
function chuanHoaTen(ten) {
  return ten
    .trim()
    .toLowerCase()
    .split(" ")
    .filter((word) => word !== "")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Đúng: phanTichDon tách được chuỗi dạng "tên sản phẩm xSỐLƯỢNG"
//       và gọi lại chuanHoaTen để chuẩn hóa tên sản phẩm.
// Góp ý: Nên trim dòng đơn trước khi split để rõ ý hơn, dù với dữ liệu hiện tại vẫn chạy đúng
//        vì chuanHoaTen(parts[0]) đã trim tên và parts[1].trim() đã trim số lượng.
// Gợi ý sửa đầy đủ:
//   function phanTichDon(dong) {
//     const parts = dong.trim().split("x");
//     const ten = chuanHoaTen(parts[0]);
//     const soLuong = Number(parts[1].trim());
//     return { ten, soLuong };
//   }
function phanTichDon(dong) {
  const parts = dong.split("x");
  const ten = chuanHoaTen(parts[0]);
  const soLuong = Number(parts[1].trim());
  return { ten, soLuong };
}

// ----- HÀM CHÍNH -----
async function tinhTienGioHang(donHang) {
  console.log("Bắt đầu tính tiền giỏ hàng...");
  console.log(`Phân tích ${donHang.length} dòng đơn hàng...`);

  try {
    // 1. Phân tích chuỗi
    // Đúng: Dùng map để chuyển mảng chuỗi đơn hàng thành mảng object { ten, soLuong }.
    const dsDonHang = donHang.map(phanTichDon);

    // 2. Song song: lấy thông tin sản phẩm
    // Đúng: Tạo mảng promises rồi dùng Promise.all để tải thông tin sản phẩm song song.
    //       Nếu có 1 sản phẩm không tồn tại, Promise.all sẽ reject và nhảy xuống catch.
    // Lưu ý: Hàm layThongTinSanPham đang được dùng ở đây nhưng file bài làm chưa khai báo lại
    //        bộ dữ liệu KHO_HANG và hàm layThongTinSanPham. Nếu chạy riêng file này và mở comment
    //        gọi tinhTienGioHang, chương trình sẽ báo lỗi layThongTinSanPham is not defined.
    //        Nên copy đầy đủ phần dữ liệu/hàm API giả lập từ đề vào bài làm để file tự chạy được.
    console.log(`Tải thông tin ${dsDonHang.length} sản phẩm...`);
    const promises = dsDonHang.map((item) => layThongTinSanPham(item.ten));
    const ketQuaKho = await Promise.all(promises);

    // 3. Xử lý mảng: ghép số lượng + tính thành tiền
    let tamTinh = 0;
    // Cần cải thiện: danhSachHopLe được khai báo nhưng không dùng.
    //                Nên xóa biến này để code gọn và tránh gây hiểu nhầm.
    const danhSachHopLe = [];

    // Kết hợp thông tin từ kho và số lượng khách đặt
    // Đúng: Dùng map + index để ghép thông tin kho với số lượng khách đặt.
    // Góp ý: Yêu cầu bài có nhắc tính thanhTien trong bước map. Hiện tại thanhTien đang tính bên dưới
    //        trong vòng for, vẫn ra kết quả đúng. Nếu muốn sát yêu cầu hơn, có thể thêm thanhTien ở đây:
    //   const chiTietDon = ketQuaKho.map((sp, index) => ({
    //     ...sp,
    //     soLuong: dsDonHang[index].soLuong,
    //     thanhTien: sp.gia * dsDonHang[index].soLuong,
    //   }));
    const chiTietDon = ketQuaKho.map((sp, index) => ({
      ...sp,
      soLuong: dsDonHang[index].soLuong,
    }));

    // Đúng: Dùng for...of để xử lý từng sản phẩm, bỏ sản phẩm không đủ tồn kho,
    //       in dòng chi tiết và cộng dồn tạm tính.
    // Góp ý: Yêu cầu có nhắc dùng filter để lọc sản phẩm đủ hàng. Code hiện tại dùng if/else trong for
    //        vẫn đúng kết quả, nhưng nếu muốn bám sát yêu cầu hơn thì có thể tách thành filter như sau:
    //   const sanPhamHopLe = chiTietDon.filter((sp) => {
    //     if (sp.tonKho < sp.soLuong) {
    //       console.log(`  Bỏ "${sp.ten}" - chỉ còn ${sp.tonKho}, cần ${sp.soLuong}`);
    //       return false;
    //     }
    //     return true;
    //   });
    //   for (const sp of sanPhamHopLe) {
    //     const thanhTienSp = sp.gia * sp.soLuong;
    //     console.log(`  ${sp.ten} x${sp.soLuong} = ${thanhTienSp.toLocaleString("vi-VN")}đ`);
    //     tamTinh += thanhTienSp;
    //   }
    for (const sp of chiTietDon) {
      if (sp.tonKho < sp.soLuong) {
        console.log(
          `  Bỏ "${sp.ten}" - chỉ còn ${sp.tonKho}, cần ${sp.soLuong}`,
        );
      } else {
        const thanhTienSp = sp.gia * sp.soLuong;
        console.log(
          `  ${sp.ten} x${sp.soLuong} = ${thanhTienSp.toLocaleString()}đ`,
        );
        tamTinh += thanhTienSp;
      }
    }

    // 4. Rẽ nhánh ưu đãi
    // Đúng: if/else nhiều cấp theo đúng thứ tự mốc tiền từ cao xuống thấp.
    let giamGia = 0;
    let phanTram = 0;

    if (tamTinh >= 1000000) {
      phanTram = 15;
    } else if (tamTinh >= 500000) {
      phanTram = 10;
    } else if (tamTinh >= 200000) {
      phanTram = 5;
    }

    // Đúng: Tính số tiền giảm và thành tiền cuối cùng đúng công thức.
    giamGia = tamTinh * (phanTram / 100);
    const tongCong = tamTinh - giamGia;

    console.log(`Tạm tính: ${tamTinh.toLocaleString()}đ`);
    // Đúng: Chỉ in dòng ưu đãi khi có giảm giá.
    // Góp ý: Dòng này dùng toán tử 3 ngôi lồng nhau nên hơi khó đọc với người mới.
    //        Có thể viết dễ hiểu hơn bằng if/else như sau:
    //   let mocGiam = 0;
    //   if (phanTram === 15) {
    //     mocGiam = 1000000;
    //   } else if (phanTram === 10) {
    //     mocGiam = 500000;
    //   } else if (phanTram === 5) {
    //     mocGiam = 200000;
    //   }
    //   if (phanTram > 0) {
    //     console.log(`Ưu đãi: giảm ${phanTram}% (đơn từ ${mocGiam.toLocaleString("vi-VN")}đ) -${giamGia.toLocaleString("vi-VN")}đ`);
    //   } else {
    //     console.log("Ưu đãi: không giảm");
    //   }
    if (phanTram > 0) {
      console.log(
        `Ưu đãi: giảm ${phanTram}% (đơn từ ${(phanTram === 15 ? 1000000 : phanTram === 10 ? 500000 : 200000).toLocaleString()}đ) -${giamGia.toLocaleString()}đ`,
      );
    }
    console.log(`Thành tiền: ${tongCong.toLocaleString()}đ`);
  } catch (error) {
    // Đúng: Có catch để bắt lỗi khi Promise.all reject.
    // Góp ý: Đề đang mong format "[LỖI] ...". Hiện tại in "LỖI: ..." vẫn hiểu được,
    //        nhưng nên thống nhất format nếu muốn output giống yêu cầu hơn:
    //          console.log("[LỖI]", error);
    console.error(`LỖI: ${error}`);
  } finally {
    // Đúng: finally luôn chạy sau cả case thành công và case lỗi.
    console.log("Kết thúc tính tiền.");
  }
}

// ----- CHẠY THỬ -----
// Cần cải thiện: Hai dòng chạy thử đang bị comment, nên khi chạy `node lesson-08-hw.js`
//                file không in ra gì. Nên bỏ comment khi nộp để giáo viên/chương trình có thể kiểm tra output.
// tinhTienGioHang(donHang1);
// tinhTienGioHang(donHang2);

// ============================================================
// TỔNG HỢP REVIEW — BÀI 1
// ============================================================
// Kết quả: GẦN ĐẠT / ĐẠT phần logic chính khi chạy với bộ dữ liệu của đề.
//
// Điểm tốt:
//   - chuanHoaTen xử lý chuỗi tốt: trim, lowercase, bỏ khoảng trắng thừa giữa các từ, viết hoa chữ cái đầu.
//   - phanTichDon tách được tên và số lượng.
//   - tinhTienGioHang dùng async/await và Promise.all đúng ý chính của bài.
//   - Có try/catch/finally đầy đủ.
//   - Tính tạm tính, phần trăm giảm giá, số tiền giảm và thành tiền đúng với donHang1.
//
// Cần cải thiện:
//   - File bài làm đang thiếu KHO_HANG, donHang1, donHang2 và layThongTinSanPham nên chưa tự chạy độc lập được.
//   - Hai dòng gọi tinhTienGioHang đang bị comment nên chạy file trực tiếp không có output.
//   - Biến danhSachHopLe đang khai báo nhưng không dùng, nên xóa.
//   - Nên dùng filter để lọc sản phẩm đủ hàng nếu muốn bám sát yêu cầu hơn.
//   - Nên dùng toLocaleString("vi-VN") để định dạng tiền ra dấu chấm kiểu Việt Nam, ví dụ 300.000đ.
//
// Gợi ý để file tự chạy được:
//   - Copy đầy đủ phần KHO_HANG, donHang1, donHang2, layThongTinSanPham từ đề vào phía trên.
//   - Bỏ comment phần chạy thử:
//       tinhTienGioHang(donHang1);
//       tinhTienGioHang(donHang2);
// ============================================================

// ============================================================
// TỔNG HỢP REVIEW — BÀI 2
// ============================================================
// Kết quả: CHƯA THẤY BÀI 2 trong file nộp.
//
// Cần bổ sung:
//   - Dữ liệu CHI_NHANH.
//   - Hàm taiDoanhThuChiNhanh.
//   - Hàm xepLoai(doanhThu).
//   - Hàm async tongHopBaoCao() dùng Promise.allSettled.
//   - Tách fulfilled/rejected bằng filter, lấy value/reason bằng map.
//   - Dùng for...of tính tổng doanh thu và tìm chi nhánh dẫn đầu.
//   - Dùng map + join để in dòng xếp loại.
//
// Gợi ý khung code đầy đủ để tự hoàn thiện:
//   function xepLoai(doanhThu) {
//     if (doanhThu >= 200000000) {
//       return "Xuất sắc";
//     } else if (doanhThu >= 100000000) {
//       return "Đạt chỉ tiêu";
//     } else if (doanhThu > 0) {
//       return "Cần cải thiện";
//     }
//     return "Không có doanh thu";
//   }
//
//   async function tongHopBaoCao() {
//     console.log("Đang tổng hợp báo cáo từ các chi nhánh...");
//     try {
//       const ketQua = await Promise.allSettled(
//         CHI_NHANH.map((cn) =>
//           taiDoanhThuChiNhanh(cn.ten, cn.doanhThu, cn.thoiGian, cn.thanhCong)
//         )
//       );
//
//       const thanhCong = ketQua.filter((item) => item.status === "fulfilled");
//       const thatBai = ketQua.filter((item) => item.status === "rejected");
//       const dsDoanhThu = thanhCong.map((item) => item.value);
//       const dsLoi = thatBai.map((item) => item.reason);
//
//       for (const loi of dsLoi) {
//         console.log(`  [LỖI] ${loi}`);
//       }
//
//       let tongDoanhThu = 0;
//       let chiNhanhDanDau = null;
//       for (const cn of dsDoanhThu) {
//         tongDoanhThu += cn.doanhThu;
//         if (chiNhanhDanDau === null || cn.doanhThu > chiNhanhDanDau.doanhThu) {
//           chiNhanhDanDau = cn;
//         }
//       }
//
//       for (const cn of dsDoanhThu) {
//         console.log(`  ${cn.chiNhanh}: ${cn.doanhThu.toLocaleString("vi-VN")}đ - ${xepLoai(cn.doanhThu)}`);
//       }
//
//       console.log(`Tổng doanh thu: ${tongDoanhThu.toLocaleString("vi-VN")}đ`);
//       if (chiNhanhDanDau !== null) {
//         console.log(`Chi nhánh dẫn đầu: ${chiNhanhDanDau.chiNhanh} (${chiNhanhDanDau.doanhThu.toLocaleString("vi-VN")}đ)`);
//       }
//
//       const chuoiXepLoai = dsDoanhThu
//         .map((cn) => `${cn.chiNhanh} (${xepLoai(cn.doanhThu)})`)
//         .join(", ");
//       console.log(`Xếp loại: ${chuoiXepLoai}`);
//
//       console.log(`${thanhCong.length}/${CHI_NHANH.length} chi nhánh thành công (${thatBai.length} gặp sự cố).`);
//     } catch (error) {
//       console.log("[LỖI]", error);
//     } finally {
//       console.log("Hoàn tất tổng hợp báo cáo.");
//     }
//   }
// ============================================================
