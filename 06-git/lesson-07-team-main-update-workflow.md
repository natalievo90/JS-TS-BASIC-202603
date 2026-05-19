# Bài 07: Làm việc nhiều ngày - main có code mới, branch mình cũng có code

Bài này giải thích luồng làm việc nhóm thường gặp:

```txt
Đầu ngày pull main mới nhất.
Tạo branch mới từ main.
Code vài ngày trên branch của mình.
Trong lúc đó main có code mới từ người khác.
Trước khi merge branch mình vào main, nên cập nhật main mới vào branch mình trước.
```

## Câu hỏi chính

Nếu mình không merge `main` mới vào branch của mình trước, rồi merge thẳng branch mình vào `main`, có được không?

Câu trả lời:

```txt
Có thể được nếu Git merge sạch.
Nhưng nếu có conflict, conflict sẽ xảy ra lúc merge vào main hoặc lúc tạo Pull Request.
```

Với học sinh mới, nên dạy quy tắc an toàn:

```txt
Trước khi đưa branch của mình vào main:
1. Pull main mới nhất.
2. Merge main vào branch của mình.
3. Fix conflict trên branch của mình nếu có.
4. Test lại.
5. Sau đó mới merge branch mình vào main.
```

## Vì sao nên fix conflict trên branch của mình?

Vì branch của mình là nơi mình đang làm việc.

Nếu conflict xảy ra, mình xử lý ở branch của mình trước:

```txt
main được giữ sạch hơn.
Kết quả resolve conflict nằm trong branch của mình.
Khi merge branch mình vào main, main nhận bản đã xử lý sẵn.
```

Không phải lúc nào cũng bắt buộc, nhưng đây là cách dễ hiểu và an toàn cho người mới.

## Sơ đồ tình huống

Ban đầu:

```txt
A -- B  main
```

Bạn tạo branch làm việc:

```txt
A -- B  main
      \
       C -- D  feature/login
```

Vài ngày sau, người khác merge code mới vào main:

```txt
A -- B -- M1 -- M2  main
      \
       C -- D       feature/login
```

Branch của bạn đang cũ hơn main.

## Luồng khuyến nghị mỗi ngày

Đầu ngày:

```bash
git checkout main
git pull origin main
git checkout -b feature/login
```

Đang làm việc trên branch:

```bash
git status
git add .
git commit -m "feat: add login flow"
```

Sau vài ngày, trước khi merge về main:

```bash
git checkout main
git pull origin main
git checkout feature/login
git merge main
```

Nếu conflict thì sửa conflict trên branch `feature/login`, rồi:

```bash
git add .
git commit -m "fix: resolve conflict with latest main"
```

Sau đó merge về main:

```bash
git checkout main
git merge feature/login
git push origin main
```

## Demo tổng quan

Demo này không dùng `main` thật.

Ta dùng các branch demo:

```txt
demo/team-main
demo/team-b-feature
```

Ý nghĩa:

```txt
demo/team-main      giả lập main của team
demo/team-b-feature giả lập branch của bạn B
```

File demo:

```txt
team-workflow-demo/login-message.txt
```

## Setup demo

### Bước 1: Tạo main demo

Chạy:

```bash
git checkout main
git pull origin main
git checkout -b demo/team-main
```

Tạo folder:

```powershell
New-Item -ItemType Directory -Force .\team-workflow-demo
```

Tạo file ban đầu:

```powershell
Set-Content .\team-workflow-demo\login-message.txt "message=Login thanh cong"
```

Commit:

```bash
git add team-workflow-demo/login-message.txt
git commit -m "demo: add team workflow base message"
```

Lúc này:

```txt
A -- B  demo/team-main
```

Trong đó:

```txt
B = commit tạo file login-message.txt
```

### Bước 2: Bạn B tạo branch từ main demo

Chạy:

```bash
git checkout -b demo/team-b-feature
```

Bạn B sửa file:

```powershell
Set-Content .\team-workflow-demo\login-message.txt "message=Login thanh cong tu nhanh cua ban B"
```

Commit:

```bash
git add team-workflow-demo/login-message.txt
git commit -m "demo: update login message from student B"
```

Lúc này:

```txt
A -- B  demo/team-main
      \
       C  demo/team-b-feature
```

### Bước 3: Giả lập người khác update main

Quay lại main demo:

```bash
git checkout demo/team-main
```

Giả lập bạn A sửa đúng dòng đó trên main:

```powershell
Set-Content .\team-workflow-demo\login-message.txt "message=Login thanh cong tu code moi tren main"
```

Commit:

```bash
git add team-workflow-demo/login-message.txt
git commit -m "demo: update login message from main"
```

Lúc này:

```txt
A -- B -- M  demo/team-main
      \
       C     demo/team-b-feature
```

Trong đó:

```txt
M = code mới trên main
C = code của bạn B trên branch riêng
```

Kiểm tra graph:

```bash
git log --oneline --graph --decorate -8 demo/team-main demo/team-b-feature
```

Ví dụ output:

```txt
* m111111 (HEAD -> demo/team-main) demo: update login message from main
| * c222222 (demo/team-b-feature) demo: update login message from student B
|/
* b333333 demo: add team workflow base message
```

## Case 1: Không merge main vào branch trước, merge thẳng branch vào main

Đây là case bạn đang hỏi.

Bạn đang ở `demo/team-main`.

Nếu chạy luôn:

```bash
git merge demo/team-b-feature
```

Git sẽ cố gộp code của `demo/team-b-feature` vào `demo/team-main`.

Vì cả 2 branch cùng sửa một dòng trong file:

```txt
team-workflow-demo/login-message.txt
```

nên có thể bị conflict:

```txt
CONFLICT (content): Merge conflict in team-workflow-demo/login-message.txt
Automatic merge failed; fix conflicts and then commit the result.
```

Kiểm tra:

```bash
git status
```

Bạn sẽ thấy:

```txt
On branch demo/team-main
You have unmerged paths.

Unmerged paths:
  both modified: team-workflow-demo/login-message.txt
```

Ý nghĩa:

```txt
Conflict đang xảy ra trên demo/team-main.
Tức là conflict rơi vào branch nhận merge.
```

Điều này không sai về mặt Git, nhưng không đẹp cho workflow học sinh mới:

```txt
Bạn đang xử lý conflict trực tiếp trên main demo.
Trong thực tế, nếu là main thật, ta thường không muốn xử lý conflict trực tiếp ở main.
```

Hủy merge để làm theo cách an toàn hơn:

```bash
git merge --abort
```

Sau khi abort:

```bash
git status
```

Kết quả mong muốn:

```txt
On branch demo/team-main
nothing to commit, working tree clean
```

## Case 2: Cách nên làm - merge main vào branch của mình trước

Quay sang branch của bạn B:

```bash
git checkout demo/team-b-feature
```

Merge main mới vào branch của mình:

```bash
git merge demo/team-main
```

Lúc này cũng có thể conflict:

```txt
CONFLICT (content): Merge conflict in team-workflow-demo/login-message.txt
Automatic merge failed; fix conflicts and then commit the result.
```

Nhưng điểm khác là:

```txt
Conflict đang xảy ra trên demo/team-b-feature.
Tức là bạn đang xử lý conflict trên branch của mình.
```

Kiểm tra:

```bash
git status
```

Bạn sẽ thấy:

```txt
On branch demo/team-b-feature
You have unmerged paths.

Unmerged paths:
  both modified: team-workflow-demo/login-message.txt
```

Mở file:

```powershell
Get-Content .\team-workflow-demo\login-message.txt
```

File có thể có dạng.

Trong tài liệu này mình thêm chữ `MARKER:` ở đầu dòng để Git không hiểu nhầm đây là conflict thật còn sót trong file `.md`.

Khi học sinh gặp conflict thật trong code, file thật sẽ không có chữ `MARKER:`.

```txt
MARKER: <<<<<<< HEAD
message=Login thanh cong tu nhanh cua ban B
MARKER: =======
message=Login thanh cong tu code moi tren main
MARKER: >>>>>>> demo/team-main
```

Giải thích:

- `<<<<<<< HEAD`: bắt đầu phần code hiện tại trên branch `demo/team-b-feature`.
- `=======`: vạch ngăn giữa 2 phiên bản code.
- `>>>>>>> demo/team-main`: kết thúc phần code từ `demo/team-main` đang được merge vào.

## Bước fix conflict trên branch của mình

Chọn nội dung cuối cùng bạn muốn giữ.

Ví dụ muốn kết hợp cả hai ý:

```powershell
Set-Content .\team-workflow-demo\login-message.txt "message=Login thanh cong voi code moi tren main va thay doi cua ban B"
```

Đánh dấu đã sửa conflict:

```bash
git add team-workflow-demo/login-message.txt
```

Commit kết quả resolve conflict:

```bash
git commit -m "fix: resolve team main conflict on student branch"
```

Lúc này lịch sử sẽ giống:

```txt
A -- B -- M  demo/team-main
      \    \
       C -- X  demo/team-b-feature
```

Trong đó:

```txt
X = merge commit trên branch demo/team-b-feature
X chứa:
- code mới từ main
- code của bạn B
- kết quả fix conflict
```

## Case 3: Sau khi fix conflict ở branch mình, merge về main

Quay về main demo:

```bash
git checkout demo/team-main
```

Merge branch của bạn B vào main demo:

```bash
git merge demo/team-b-feature
```

Lần này thường không conflict nữa.

Vì sao?

```txt
demo/team-b-feature đã chứa commit M của demo/team-main.
demo/team-b-feature cũng đã chứa commit X là kết quả resolve conflict.
```

Git nhìn thấy:

```txt
demo/team-main đang ở M.
demo/team-b-feature đang ở X.
X đã có M trong lịch sử.
```

Nên Git chỉ cần đưa `demo/team-main` tiến lên `X`.

Sau merge:

```txt
A -- B -- M ---- X  demo/team-main
      \    \    /
       C ------
```

Kiểm tra file:

```powershell
Get-Content .\team-workflow-demo\login-message.txt
```

Kết quả:

```txt
message=Login thanh cong voi code moi tren main va thay doi cua ban B
```

Kiểm tra log:

```bash
git log --oneline --graph --decorate -8 demo/team-main demo/team-b-feature
```

Ví dụ output:

```txt
*   x999999 (HEAD -> demo/team-main, demo/team-b-feature) fix: resolve team main conflict on student branch
|\
| * m111111 demo: update login message from main
* | c222222 demo: update login message from student B
|/
* b333333 demo: add team workflow base message
```

Ý nghĩa:

```txt
Conflict đã được giải quyết ở X.
main demo nhận lại X.
Không cần resolve lại cùng conflict đó.
```

## Khi nào vẫn có thể conflict lại?

Nếu sau khi bạn tạo commit `X`, người khác lại merge thêm commit mới vào main.

Ví dụ:

```txt
A -- B -- M -- M2  demo/team-main
      \    \
       C -- X      demo/team-b-feature
```

Nếu `M2` lại sửa đúng dòng/file liên quan, khi merge branch của bạn về main vẫn có thể conflict tiếp.

Vì vậy trước khi merge cuối cùng, làm lại bước an toàn:

```bash
git checkout main
git pull origin main
git checkout feature/login
git merge main
```

Nếu có conflict thì fix tiếp trên branch của mình.

Sau đó mới merge về main.

## Kết luận cho học sinh

Không nên hiểu cứng rằng:

```txt
Phải merge main vào branch mình thì Git mới merge về main được.
```

Hiểu đúng là:

```txt
Nếu không merge main vào branch mình trước, Git vẫn có thể merge branch mình vào main.
Nhưng nếu có conflict, conflict sẽ rơi vào lúc merge vào main hoặc lúc tạo Pull Request.
```

Luồng an toàn:

```bash
git checkout main
git pull origin main

git checkout feature/login
git merge main

# nếu conflict thì sửa, git add, git commit

git checkout main
git merge feature/login
git push origin main
```

Với người mới:

```txt
Conflict nên được xử lý trên branch của mình trước.
Sau đó main chỉ nhận branch đã được xử lý sạch.
```
