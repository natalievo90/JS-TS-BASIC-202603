## Bài 1: Quản lý danh sách sản phẩm


class ProductStore {
  // Private field lưu trữ danh sách sản phẩm
  #products = [];

  addProduct(product) {
    // 1. Kiểm tra các trường bắt buộc phải tồn tại trước khi xử lý chuỗi
    if (!product || product.id === undefined || !product.name || !product.category || product.price === undefined || product.inStock === undefined) {
      return { success: false, message: "Thông tin sản phẩm không đầy đủ" };
    }

    const trimmedId = String(product.id).trim();
    const trimmedName = String(product.name).trim();
    const trimmedCategory = String(product.category).trim();

    // 2. Validate trùng ID
    const isDuplicateId = this.#products.some(p => p.id === trimmedId);
    if (isDuplicateId) {
      return { success: false, message: "Id sản phẩm đã tồn tại" };
    }

    // 3. Validate name rỗng
    if (trimmedName === "") {
      return { success: false, message: "Tên sản phẩm không được để trống" };
    }

    // 4. Validate category rỗng
    if (trimmedCategory === "") {
      return { success: false, message: "Danh mục không được để trống" };
    }

    // 5. Validate price > 0
    if (typeof product.price !== 'number' || product.price <= 0) {
      return { success: false, message: "Giá sản phẩm phải lớn hơn 0" };
    }

    // 6. Validate inStock là boolean
    if (typeof product.inStock !== 'boolean') {
      return { success: false, message: "Trạng thái kho hàng phải là kiểu boolean" };
    }

    // Thêm sản phẩm đã chuẩn hóa vào mảng private
    this.#products.push({
      id: trimmedId,
      name: trimmedName,
      category: trimmedCategory,
      price: product.price,
      inStock: product.inStock
    });

    return { success: true, message: "Thêm sản phẩm thành công" };
  }

  findByName(keyword) {
    if (!keyword) return [];
    const cleanKeyword = String(keyword).trim().toLowerCase();
    return this.#products.filter(p => p.name.toLowerCase().includes(cleanKeyword));
  }

  filterByCategory(category) {
    if (!category) return [];
    const cleanCategory = String(category).trim().toLowerCase();
    return this.#products.filter(p => p.category.toLowerCase() === cleanCategory);
  }

  getAvailableProducts() {
    return this.#products.filter(p => p.inStock === true);
  }

  getTotalInventoryValue() {
    const availableProducts = this.getAvailableProducts();
    if (availableProducts.length === 0) return 0;
    
    return availableProducts.reduce((total, p) => total + p.price, 0);
  }
}

class DiscountProductStore extends ProductStore {
  constructor(discountRate) {
    super();
    this.discountRate = discountRate || 0; // Ví dụ: 0.1 đại diện cho 10%
  }

  // Override tính tổng giá trị kho sau khi giảm giá
  getTotalInventoryValue() {
    const originalTotal = super.getTotalInventoryValue();
    return originalTotal * (1 - this.discountRate);
  }

  getDiscountInfo() {
    const originalTotal = super.getTotalInventoryValue();
    const discountAmount = originalTotal * this.discountRate;
    const finalTotal = originalTotal - discountAmount;

    return {
      originalTotal,
      discountRate: this.discountRate,
      discountAmount,
      finalTotal
    };
  }
}

// === CHẠY THỬ BÀI TEST MẪU BÀI 1 ===
console.log("--- BÀI 1 TEST ---");
const store = new DiscountProductStore(0.1);

console.log(store.addProduct({ id: "p01", name: "  iPhone 15 Pro  ", category: "phone", price: 29990000, inStock: true }));
console.log(store.addProduct({ id: "p02", name: "MacBook Air", category: "laptop", price: 24990000, inStock: true }));
console.log(store.addProduct({ id: "p03", name: "AirPods Pro", category: "audio", price: 5990000, inStock: false }));
console.log(store.addProduct({ id: "p01", name: "Duplicate", category: "phone", price: 1000, inStock: true })); // Lỗi trùng ID

console.log("Tìm kiếm 'iphone':", store.findByName("iphone"));
console.log("Lọc theo ' PHONE ':", store.filterByCategory(" PHONE "));
console.log("Sản phẩm còn hàng:", store.getAvailableProducts());
console.log("Thông tin hóa đơn giảm giá:", store.getDiscountInfo());


### Bài 2: Giỏ hàng có mã giảm giá


class Cart {
  #items = [];
  discountRate = 0;

  addItem(item) {
    if (!item.name || item.name.trim() === "") {
      return { success: false, message: "Tên sản phẩm không được rỗng" };
    }

    if (typeof item.price !== "number" || item.price <= 0) {
      return { success: false, message: "Giá phải lớn hơn 0" };
    }

    if (typeof item.quantity !== "number" || item.quantity <= 0) {
      return { success: false, message: "Số lượng phải lớn hơn 0" };
    }

    const itemName = item.name.trim();
    const existingItem = this.#items.find(
      i => i.name.trim().toLowerCase() === itemName.toLowerCase()
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

  removeItem(name) {
    const key = name.trim().toLowerCase();

    this.#items = this.#items.filter(
      item => item.name.toLowerCase() !== key
    );
  }

  getSubtotal() {
    return this.#items.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  }

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

class VipCart extends Cart {
  constructor(memberName) {
    super();
    this.memberName = memberName;
  }

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

  checkout() {
    const result = super.checkout();

    return {
      ...result,
      memberName: this.memberName,
      cartType: "VIP",
    };
  }
}