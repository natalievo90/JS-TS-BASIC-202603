//1 class field có giá trị khởi tạo -> không bắt buộc phải gán giá trị cho chúng trong constructor
class LoginPage{
    url: string="login";
    txtUsername: string="txtUsername";
    txtPassword: string="txtPassword"
}

const page = new LoginPage();
console.log(page.url);
console.log(page.txtUsername);
console.log(page.txtPassword);

//2 class field ko có gia trị  -> bắt buộc phải gán giá trị cho chúng trong constructor
class HocVien{
    hoTen: string;
    tuoi: number;
    email: string;
    constructor(hoTen: string, tuoi: number, email: string){
        this.hoTen = hoTen;
        this.tuoi = tuoi;
        this.email = email;
    }
}
const hv1 = new HocVien("Nguyen Van A", 20, "nguyenvana@email.com");
console.log(hv1.hoTen);
console.log(hv1.tuoi);
console.log(hv1.email);

//3-combo ket hop class field + constructor
class Product{
    catalog: string="general";
    tags: string[]=[];
    rating: number=0;
    constructor(public name: string, public price: number){
        this.name = name;
        this.price = price;
    }
}
const p1 = new Product("Iphone 14 Pro Max", 30000000);
console.log(p1.catalog);
console.log(p1.tags);
console.log(p1.rating);
console.log(p1.name);
console.log(p1.price);

class UserProfile{
     name: string;
  email: string;
  avatarUrl?: string;
  constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
  }
}

const user2 = new UserProfile("neko", "neko@gmail.com");
console.log(user2.name);
console.log(user2.avatarUrl);

class TestConfig {
  //Bat buoc test nao cung can

  browser: string;
  baseUrl: string;

  //optional
  screenshot?: "on" | "off";
  retryCount?: number;
  tags?: string[];

  constructor(browser: string, baseUrl: string) {
    this.browser = browser;
    this.baseUrl = baseUrl;
  }
  summary(): string {
    const retry = this.retryCount ?? 0;
    const scrn = this.screenshot ?? "off";
    const tagList = this.tags?.join(", ") ?? "all";
    return `Browser: ${this.browser}, Base URL: ${this.baseUrl}, Screenshot: ${scrn}, Retry Count: ${retry}, Tags: ${tagList}`;
  }
}
const config = new TestConfig("firefox", "https://example.com");
console.log(config.summary());

config.screenshot = "on";
config.retryCount = 3;
config.tags = ["smoke", "regression"];
console.log(config.summary());  

//readonly field
class AppConfig {
    readonly appName: string= "Neko App";
    readonly version: string= "1.0.0";
    constructor(version: string){
        this.version = version;
    }
}
const appConfig = new AppConfig("2.0.0");
console.log(appConfig.appName);
console.log(appConfig.version);
// appConfig.appName = "New App"; //Lỗi vì appName là readonly
// appConfig.version = "3.0.0"; //Lỗi vì version là readonly

class UserOK{
  name!: string;
}
const user = new UserOK();
user.name = "neko";
console.log(user.name.toUpperCase()); 
class Database{
    connection: string | null = null;
    async connect(url: string){
        this.connection = url;
    }
    query(sql: string){
        return `${this.connection} - Executing query: ${sql}`;
    }
    isConnected(): boolean{
        return this.connection !== null;
    }
}

async function runSQL() {
  const db = new Database();
  console.log(db.isConnected());
  await db.connect("mongo://localhost:28101");
  //db.connect()
  console.log(db.query("SELECT * FROM"));
}

class HocVienDai {
  hoTen: string;
  tuoi: number;

  constructor(hoTen: string, tuoi: number) {
    this.hoTen = hoTen;
    this.tuoi = tuoi;
  }
}

//parameter properties

class HocVienNgan {
  constructor(
    public hoTen: string,
    public tuoi: number,
  ) {}
}


const hv2 = new HocVienNgan("neko2", 23);

class LoginPage2{
    readonly url: string="/login";
    readonly btnSubmit: string="btnSubmit";
    constructor(public timeout: number){}
}

class TestConfig2 {
     //classfield MAc dinh
  //gia tri co dinh moi instance deu gion nhau
  readonly url = "/login";
  constructor(
    public browser: string = "chromium",
    public headless: boolean = true,
  ) {}
    summary() {
        return `Browser: ${this.browser}, Headless: ${this.headless}`;
    }

}
const tcg2 = new TestConfig2();
tcg2.summary();
const tcg3 = new TestConfig2("firefox", true);
tcg3.summary();


class Animal {
  constructor(
    public name: string,
    public sound: string,
   ) {}

  public speak(): string {
    return `${this.name} keu: ${this.sound}`;
  }
}

const cat = new Animal("Meo", "Meo meo");
console.log(cat.speak());
cat.name ="meo may";
console.log(cat.speak());

class BankAccount {
  constructor(
    public ownwer: string,
    private balance: string,
    private pin: string,
  ) {}

  deposit(amount: number) {
    this.balance += amount;
    console.log(`${amount} => so du ${this.balance}`);
  }

  getBalance(inputPin: string): string {
    if (inputPin !== this.pin) return `Sai PIN`;
    return `So du ${this.balance}`;
  }
}

const account = new BankAccount("neko", "20000000", "123456");
account.getBalance("123456");
// console.log(account.balance);
class BasePage {
  constructor(
    public url: string,
    private secret: string = "xxx",
    protected baseUrl = "http:neko.com",
  ) {}

  protected getFullUrl(): string {
    return `${this.baseUrl}${this.url}`;
  }
}

class LoginPage3 extends BasePage {
  constructor() {
    super("/login");
  }
    goto() {
    const fullUrl = this.getFullUrl();
    console.log(`Truy cap den trang web ${fullUrl}`);

    console.log(`Base URl: ${this.baseUrl}`);
  }

}
const loginPage3 = new LoginPage3();

loginPage3.goto();
console.log(loginPage3.url);

class User3 {
  //_ convention prefix
  private _name: string;
  private _age: number;
  constructor(name: string, age: number) {
    this._name = name;
    this._age = age;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    if (value.trim() === "") {
      throw new Error("Ten ko dc rong");
    }
    this._name = value;
  }
}

const user3 = new User3("neko", 25);
// console.log(user3.name);
// user3.name = "";

//Promise<T>
//Tra ve object hoac array
class TestReport {
  private results: { name: string; passed: boolean }[] = [];

  addResult(name: string, passed: boolean): void {
    this.results.push({ name, passed });
  }

  //return object
  getSummary(): { total: number; passed: number; failed: number } {
    const passed = this.results.filter((r) => r.passed).length;
    return {
      total: this.results.length,
      passed,
      failed: this.results.length - passed,
    };
  }

  //return array
  getFailedTest(): string[] {
    return this.results.filter((r) => !r.passed).map((r) => r.name);
  }
}

const report = new TestReport();
report.addResult("login test", true);
report.addResult("search test", false);
report.addResult("cart test", true);

console.log(report.getSummary());

console.log(report.getFailedTest());

class Counter {
  //thuoc tinh ma moi instnace (object deu co 1 ban sao)

  count: number = 0;

  constructor(public name: string) {
    Counter.totalCreated++;
  }

  increment(): void {
    this.count++;
  }
  //Static bien dem CHUNG CHO TAT CA THUOC VE CLASS
  static totalCreated: number = 0;
  static showTotal(): void {
    console.log(`Tổng cộng đc tạo ${Counter.totalCreated}`);
  }
}

const a = new Counter("Counter A");
const b = new Counter("Counter B");
const c = new Counter("Counter C");

a.increment();
a.increment();
b.increment();
b.increment();
c.increment();

console.log(a.count);
console.log(b.count);
console.log(c.count);

//NHUNG STATIC LA PROPERY CHUNG

console.log(Counter.totalCreated);
Counter.showTotal();


