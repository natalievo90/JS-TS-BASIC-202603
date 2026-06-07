// ============================================================
// FILE REVIEW - HW07 OOP - Natalievo
//nộp bài file .js nhé
// ============================================================

//## Bài 1: Quản lý danh sách sản phẩm

class ProductStore {
  // Đúng: Private field #products.
  #products = [];

  addProduct(product) {
    // Đúng: Kiểm tra thiếu field trước khi xử lý -> tránh lỗi runtime.
    if (
      !product ||
      product.id === undefined ||
      !product.name ||
      !product.category ||
      product.price === undefined ||
      product.inStock === undefined
    ) {
      return { success: false, message: "Thông tin sản phẩm không đầy đủ" };
    }

    // Đúng: Dùng String() để đảm bảo id/name/category luôn là chuỗi
    //       trước khi .trim() -> không lo bị lỗi nếu truyền số.
    const trimmedId = String(product.id).trim();
    const trimmedName = String(product.name).trim();
    const trimmedCategory = String(product.category).trim();

    // Đúng: .some() check trùng ID -> gọn.
    const isDuplicateId = this.#products.some((p) => p.id === trimmedId);
    if (isDuplicateId) {
      return { success: false, message: "Id sản phẩm đã tồn tại" };
    }

    if (trimmedName === "") {
      return { success: false, message: "Tên sản phẩm không được để trống" };
    }

    if (trimmedCategory === "") {
      return { success: false, message: "Danh mục không được để trống" };
    }

    // Đúng: typeof + <= 0 -> validate chặt chẽ.
    if (typeof product.price !== "number" || product.price <= 0) {
      return { success: false, message: "Giá sản phẩm phải lớn hơn 0" };
    }

    if (typeof product.inStock !== "boolean") {
      return {
        success: false,
        message: "Trạng thái kho hàng phải là kiểu boolean",
      };
    }

    // Đúng: Lưu dữ liệu đã chuẩn hóa (trim tên/category, giữ nguyên hoa thường).
    this.#products.push({
      id: trimmedId,
      name: trimmedName,
      category: trimmedCategory,
      price: product.price,
      inStock: product.inStock,
    });

    return { success: true, message: "Thêm sản phẩm thành công" };
  }

  // Đúng: Nếu keyword rỗng -> return [] sớm, tránh lọc vô ích.
  //       filter + includes + lowercase -> tìm đúng, trả MẢNG OBJECT.
  findByName(keyword) {
    if (!keyword) return [];
    const cleanKeyword = String(keyword).trim().toLowerCase();
    return this.#products.filter((p) =>
      p.name.toLowerCase().includes(cleanKeyword),
    );
  }

  // Đúng: Dùng === (khớp chính xác), filter, trả MẢNG OBJECT.
  filterByCategory(category) {
    if (!category) return [];
    const cleanCategory = String(category).trim().toLowerCase();
    return this.#products.filter(
      (p) => p.category.toLowerCase() === cleanCategory,
    );
  }

  // Đúng: filter inStock, trả mảng object đầy đủ.
  getAvailableProducts() {
    return this.#products.filter((p) => p.inStock === true);
  }

  // Đúng: Gọi getAvailableProducts() tái sử dụng code.
  //       Check length === 0 -> return 0 an toàn. Dùng reduce.
  getTotalInventoryValue() {
    const availableProducts = this.getAvailableProducts();
    if (availableProducts.length === 0) return 0;

    return availableProducts.reduce((total, p) => total + p.price, 0);
  }
}

// ===== CLASS KẾ THỪA =====
// Góp ý: discountRate nên dùng private field (#discountRate) cho nhất quán
//        với #products ở lớp cha. Hiện đang là field thường.
class DiscountProductStore extends ProductStore {
  constructor(discountRate) {
    super();
    // Đúng: Có fallback `|| 0` -> nếu không truyền discountRate hoặc
    //       truyền giá trị falsy thì mặc định là 0 (không giảm). Tốt!
    this.discountRate = discountRate || 0;
  }

  // Đúng: Gọi super.getTotalInventoryValue() rồi áp discount.
  getTotalInventoryValue() {
    const originalTotal = super.getTotalInventoryValue();
    return originalTotal * (1 - this.discountRate);
  }

  // Đúng: Gọi super 1 lần, lưu biến, tái sử dụng.
  getDiscountInfo() {
    const originalTotal = super.getTotalInventoryValue();
    const discountAmount = originalTotal * this.discountRate;
    const finalTotal = originalTotal - discountAmount;

    return {
      originalTotal,
      discountRate: this.discountRate,
      discountAmount,
      finalTotal,
    };
  }
}

// === TEST BÀI 1 ===
console.log("--- BÀI 1 TEST ---");
const store = new DiscountProductStore(0.1);

console.log(
  store.addProduct({
    id: "p01",
    name: "  iPhone 15 Pro  ",
    category: "phone",
    price: 29990000,
    inStock: true,
  }),
);
console.log(
  store.addProduct({
    id: "p02",
    name: "MacBook Air",
    category: "laptop",
    price: 24990000,
    inStock: true,
  }),
);
console.log(
  store.addProduct({
    id: "p03",
    name: "AirPods Pro",
    category: "audio",
    price: 5990000,
    inStock: false,
  }),
);
console.log(
  store.addProduct({
    id: "p01",
    name: "Duplicate",
    category: "phone",
    price: 1000,
    inStock: true,
  }),
);

console.log("Tìm kiếm 'iphone':", store.findByName("iphone"));
console.log("Lọc theo ' PHONE ':", store.filterByCategory(" PHONE "));
console.log("Sản phẩm còn hàng:", store.getAvailableProducts());
console.log("Thông tin hóa đơn giảm giá:", store.getDiscountInfo());

//### Bài 2: Giỏ hàng có mã giảm giá

class Cart {
  // Đúng: #items private.
  #items = [];
  // Góp ý: Nên dùng private field (#discountRate) cho nhất quán.
  discountRate = 0;

  addItem(item) {
    // Góp ý: Nên kiểm tra !item.name thay vì chỉ item.name.trim(),
    //        vì nếu name là undefined/null thì .trim() sẽ lỗi.
    if (!item.name || item.name.trim() === "") {
      return { success: false, message: "Tên sản phẩm không được rỗng" };
    }

    // Đúng: typeof + <= 0 -> validate chặt chẽ.
    if (typeof item.price !== "number" || item.price <= 0) {
      return { success: false, message: "Giá phải lớn hơn 0" };
    }

    if (typeof item.quantity !== "number" || item.quantity <= 0) {
      return { success: false, message: "Số lượng phải lớn hơn 0" };
    }

    const itemName = item.name.trim();
    // Đúng: Dùng .find() tìm item trùng tên (lowercase) -> gọn.
    //       Nếu có -> cộng quantity. Nếu không -> push mới.
    const existingItem = this.#items.find(
      (i) => i.name.trim().toLowerCase() === itemName.toLowerCase(),
    );

    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      this.#items.push({
        name: itemName,
        price: item.price,
        quantity: item.quantity,
      });
    }

    return { success: true, message: "Thêm vào giỏ hàng thành công" };
  }

  // Đúng: Chuẩn hóa tên, so sánh lowercase -> xóa đúng.
  removeItem(name) {
    const key = name.trim().toLowerCase();

    this.#items = this.#items.filter((item) => item.name.toLowerCase() !== key);
  }

  // Đúng: Dùng reduce tính tổng price * quantity.
  getSubtotal() {
    return this.#items.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  }

  // Đúng: trim + toUpperCase code. Set discountRate, return boolean.
  //       Khi mã không hợp lệ -> set discountRate = 0 -> reset giảm giá.
  applyCoupon(code) {
    const coupon = code.trim().toUpperCase();

    if (coupon === "SALE10") {
      this.discountRate = 0.1;
      return true;
    }

    if (coupon === "SALE20") {
      this.discountRate = 0.2;
      return true;
    }

    this.discountRate = 0;
    return false;
  }

  // Đúng: Tính subtotal -> discount -> total.
  // Góp ý: items đang trả về tham chiếu gốc (this.#items), người ngoài
  //        có thể sửa được giỏ hàng qua object checkout.
  //        Nên dùng .map(i => ({...i})) để trả bản sao như 1 số bạn khác.
  checkout() {
    const subtotal = this.getSubtotal();
    const discount = subtotal * this.discountRate;
    const total = subtotal - discount;

    return {
      items: this.#items,
      subtotal,
      discount,
      total,
    };
  }
}

// ===== CLASS KẾ THỪA =====
class VipCart extends Cart {
  constructor(memberName) {
    super();
    this.memberName = memberName;
  }

  // Đúng: Gọi super.applyCoupon(code) trước để thử SALE10/SALE20.
  //       Nếu OK -> return true. Nếu không -> kiểm tra VIP30.
  applyCoupon(code) {
    const normalCouponResult = super.applyCoupon(code);

    if (normalCouponResult) {
      return true;
    }

    const coupon = code.trim().toUpperCase();

    if (coupon === "VIP30") {
      this.discountRate = 0.3;
      return true;
    }

    return false;
  }

  // Đúng: Gọi super.checkout(), spread thêm memberName + cartType.
  checkout() {
    const result = super.checkout();

    return {
      ...result,
      memberName: this.memberName,
      cartType: "VIP",
    };
  }
}

// === TEST BÀI 2 ===
console.log("--- BÀI 2 TEST ---");
const cart = new VipCart("Neko");

console.log(
  cart.addItem({ name: "Trà sữa trân châu", price: 30000, quantity: 2 }),
);
console.log(
  cart.addItem({ name: "  trà SỮA trân châu  ", price: 30000, quantity: 1 }),
);
console.log(cart.addItem({ name: "Trà đào", price: 25000, quantity: 1 }));

console.log("applyCoupon(' vip30 '):", cart.applyCoupon(" vip30 "));
console.log("checkout:", cart.checkout());

// ============================================================
// TỔNG HỢP REVIEW — BÀI 1
// ============================================================
// Kết quả: ĐẠT — code chạy đúng, output khớp 100% với đề.
//
// Điểm tốt:
//   - Validate "thông tin không đầy đủ" ngay đầu addProduct
//   - Dùng String() bọc id/name/category trước khi .trim() -> an toàn
//     với mọi kiểu dữ liệu đầu vào.
//   - findByName/filterByCategory có guard !keyword -> return [] sớm.
//   - filterByCategory dùng === (khớp chính xác).
//   - getTotalInventoryValue gọi getAvailableProducts() tái sử dụng.
//   - getDiscountInfo gọi super 1 lần + tái sử dụng -> tối ưu.
//   - Constructor DiscountProductStore có fallback `|| 0`.
//
// Cần cải thiện:
//   - discountRate nên dùng private field (#discountRate).
//
// ============================================================

// ============================================================
// TỔNG HỢP REVIEW — BÀI 2
// ============================================================
// Kết quả: ĐẠT — code chạy đúng, output khớp 100% với đề.
//
// Điểm tốt:
//   - addItem gộp quantity đúng khi trùng tên.
//   - applyCoupon: trim + toUpperCase, return boolean.
//   - applyCoupon reset discountRate = 0 khi mã sai -> sạch.
//   - VipCart.applyCoupon: gọi super trước, đúng logic.
//   - VipCart.checkout: spread baseResult, thêm memberName + cartType.
//   - Dùng reduce cho getSubtotal.
//
// Cần cải thiện:
//   - discountRate nên dùng private field.
//   - addItem: nên kiểm tra !item.name trước .trim() (phòng undefined).
//   - checkout items: nên trả bản sao thay vì tham chiếu gốc.
//
