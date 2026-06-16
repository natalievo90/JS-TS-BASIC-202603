//## Bài 1: Tính tiền giỏ hàng Neko Shop
// ----- HÀM XỬ LÝ CHUỖI -----
function chuanHoaTen(ten) {
  return ten
    .trim()
    .toLowerCase()
    .split(" ")
    .filter(word => word !== "")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

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
    const dsDonHang = donHang.map(phanTichDon);

    // 2. Song song: lấy thông tin sản phẩm
    console.log(`Tải thông tin ${dsDonHang.length} sản phẩm...`);
    const promises = dsDonHang.map(item => layThongTinSanPham(item.ten));
    const ketQuaKho = await Promise.all(promises);

    // 3. Xử lý mảng: ghép số lượng + tính thành tiền
    let tamTinh = 0;
    const danhSachHopLe = [];

    // Kết hợp thông tin từ kho và số lượng khách đặt
    const chiTietDon = ketQuaKho.map((sp, index) => ({
      ...sp,
      soLuong: dsDonHang[index].soLuong
    }));

    for (const sp of chiTietDon) {
      if (sp.tonKho < sp.soLuong) {
        console.log(`  Bỏ "${sp.ten}" - chỉ còn ${sp.tonKho}, cần ${sp.soLuong}`);
      } else {
        const thanhTienSp = sp.gia * sp.soLuong;
        console.log(`  ${sp.ten} x${sp.soLuong} = ${thanhTienSp.toLocaleString()}đ`);
        tamTinh += thanhTienSp;
      }
    }

    // 4. Rẽ nhánh ưu đãi
    let giamGia = 0;
    let phanTram = 0;

    if (tamTinh >= 1000000) {
      phanTram = 15;
    } else if (tamTinh >= 500000) {
      phanTram = 10;
    } else if (tamTinh >= 200000) {
      phanTram = 5;
    }

    giamGia = tamTinh * (phanTram / 100);
    const tongCong = tamTinh - giamGia;

    console.log(`Tạm tính: ${tamTinh.toLocaleString()}đ`);
    if (phanTram > 0) {
      console.log(`Ưu đãi: giảm ${phanTram}% (đơn từ ${(phanTram === 15 ? 1000000 : phanTram === 10 ? 500000 : 200000).toLocaleString()}đ) -${giamGia.toLocaleString()}đ`);
    }
    console.log(`Thành tiền: ${tongCong.toLocaleString()}đ`);

  } catch (error) {
    console.error(`LỖI: ${error}`);
  } finally {
    console.log("Kết thúc tính tiền.");
  }
}

// ----- CHẠY THỬ -----
// tinhTienGioHang(donHang1);
// tinhTienGioHang(donHang2);