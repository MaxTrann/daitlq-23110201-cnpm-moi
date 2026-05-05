# Giải thích bài tập tuần 01 (Fullstack01)

## Giải thích cấu trúc folder trong project CRUD ExpressJS + Sequelize + MySQL

### Tổng quan

- `node_modules/` : nơi npm cài toàn bộ thư viện của project như `express`, `sequelize`, `mysql2`, `ejs`, `nodemon`. Đây là thư mục phụ thuộc, không phải nơi mình tự code logic bài tập.
- `src/config/`: chứa phần cấu hình. Các file trong đây thường lo việc kết nối database, cấu hình `view engine`, và cấu hình Sequelize.
- `src/controller/`: chứa controller, tức là nơi nhận request từ route rồi gọi service để xử lý. Trong project này đang dùng `controller` số ít, nhưng nhiều project khác có thể đặt là `controllers`.
- `src/migrations/`: chứa các file migration của Sequelize. Mỗi file ở đây mô tả cách tạo, sửa hoặc xóa bảng trong database. Khi chạy lệnh `npx sequelize-cli db:migrate`, Sequelize sẽ đọc thư mục này để tạo bảng.
- `src/models/`: chứa model Sequelize, tức là ánh xạ bảng database thành đối tượng trong code. Ví dụ `user.js` tương ứng với bảng `User`.
- `src/public/`: chứa file tĩnh như CSS, JavaScript frontend, hình ảnh. Nếu project có giao diện đầy đủ hơn thì thư mục này sẽ được dùng nhiều.
- `src/route/`: chứa định nghĩa các URL endpoint của ứng dụng, ví dụ route trang chủ, route tạo user, route sửa user, route xóa user.
- `src/seeders/`: chứa seeder của Sequelize. Seeder dùng để thêm dữ liệu mẫu vào database. Trong bài này có thể thư mục này chưa được dùng.
- `src/services/`: chứa business logic, tức là phần xử lý chính như create, read, update, delete user. Controller thường sẽ gọi vào đây.
- `src/views/`: chứa các file giao diện `EJS` để render HTML ra trình duyệt, ví dụ form nhập user, danh sách user, form cập nhật user.

### Giải thích luồng hoạt động giữa các folder trong bài CRUD

- `route` nhận URL mà người dùng gọi vào.
- `controller` nhận request từ `route`.
- `controller` gọi `service` để xử lý dữ liệu.
- `service` làm việc với `model`.
- `model` giao tiếp với MySQL thông qua Sequelize.
- `views` dùng để hiển thị dữ liệu ra giao diện.
- `config` hỗ trợ toàn bộ phần cài đặt và kết nối.

### Các file cấu hình liên quan

- `.sequelizerc`: dùng để khai báo cho Sequelize CLI biết các folder của project đang nằm ở đâu, ví dụ migration ở `src/migrations`, model ở `src/models`, config ở `src/config/config.json`.
- `package.json`: chứa thông tin project, danh sách thư viện và các lệnh chạy như `npm start`.
- `.env`: chứa biến môi trường như `PORT`, tên database, user, password,...
- `.babelrc`: cấu hình Babel để hỗ trợ chạy cú pháp `import/export`.
- `src/server.js`: là điểm khởi động của project, nơi kết nối `config`, `route`, `view engine` và `database` lại với nhau.

## Bước 1: Khởi tạo file package.json

`npm init` là lệnh dùng để khởi tạo một project NodeJS, tạo ra file package.json nhằm quản lý thông tin project, dependencies và các script chạy ứng dụng.

`dependencies` là thư viện cần để app chạy thật.

- Express dùng để xây dựng server và xử lý request
- Sequelize là ORM giúp thao tác với MySQL thông qua mysql2 driver
- body-parser dùng để đọc dữ liệu từ request
- dotenv quản lý biến môi trường
- EJS dùng để render view và bcryptjs dùng để mã hóa mật khẩu nhằm đảm bảo bảo mật

`devDependencies` là thư viện chỉ dùng khi lập trình, không bắt buộc khi chạy production.

- nodemon: tự restart server khi sửa code
- sequelize-cli: công cụ tạo migration
- @babel/core, @babel/node: hỗ trợ cú pháp ES module/babel

`scripts`: npm start, npm run dev

- Khi chạy `npm start` thì sẽ chạy `node src/server.js`
- Khi chạy `npm run dev` thì sẽ chạy `nodemon src/server.js`
  => Sự khác nhau:
  npm start = chạy app bình thường; npm run dev = chạy khi đang code, sửa file là tự reload

## Bước 2: Cài đặt các thư viện cần thiết trong package

- `npm install --save express body-parser dotenv ejs sequelize mysql2`
- `npm install --save-dev @babel/core @babel/node @babel/preset-env nodemon sequelize-cli`
- `node_modules/.bin/sequelize init` == `npx sequelize-cli init`: lệnh này sẽ tạo các thư mục/file mặc định như: `config/config.json`, `models/`, `migrations/`, `seeders/ `

## Bước 3: Tạo file .sequelizerc, .env, .babelrc

- `path.resolve(./src/config + config.json)`: ghép lại thành đường dẫn tuyệt đối → /Users/.../project/src/config/config.json
- `.babelrc`: Babel = công cụ "dịch" JavaScript mới → JavaScript cũ, dùng `preset-env` (bộ quy tắc chuyển đổi) để tự động quyết định cần convert những gì dựa vào môi trường (node ver, browser).

## Bước 4: Tạo thư mục src\config và tạo các file sau: config.json, configdb.js, viewEngine.js

- `config.json`: Việc tách thành 3 phần giúp mỗi môi trường dùng một cấu hình database riêng, tránh bị nhầm lẫn dữ liệu giữa lúc code, test và deploy.
- `configdb.js`: khởi tạo kết nối từ ứng dụng Node.js đến MySQL bằng thư viện `Sequelize`
  - `let connectDB = async () => {}`: let là dùng để khởi tạo một tên biến, `() => {}`: arrow function (hàm mũi tên), `async`: hàm bất đồng bộ để sử dụng `await`: dùng để chờ tác vụ bất đồng bộ hoàn thành
  - **module.exports**: xuất hàm ra khỏi file hiện tại, để file khác có thể sử dụng lại
- `viewEngine.js`: cấu hình giao diện cho ứng dụng Express, cụ thể:
  - Khai báo thư mục chứa file tĩnh
  - Khai báo dùng EJS là view engine
    - `EJS` là một template engine giúp **nhúng JS vào trong HTML**
    - <% ... %>: viết code JavaScript nhưng không in ra màn hình.
    - <%= %>: Dùng để in dữ liệu ra giao diện.
    - <%- %>: Dùng để in dữ liệu ra giao diện nhưng không escape HTML.
  - Khai báo thư mục chứa các file giao diện

## Bước 5: Cấu hình server.js và tạo cấu trúc dự án

- File khởi động chính của ứng dụng. Khi bạn chạy `npm start`, Node sẽ chạy file này trước, rồi từ đây nó dựng server, cấu hình middleware, route, view engine và kết nối database.
- Cấu hình `middleware` để đọc dữ liệu request
  - mọi request đi vào app sẽ đi qua middleware này trước. Middleware này có nhiệm vụ đọc phần `body` của request nếu dữ liệu gửi lên là JSON, rồi gắn kết quả vào `req.body.`
  - `bodyParser.json()` dùng khi client gửi JSON.
  - `bodyParser.urlencoded({ extended: true })` dùng khi client gửi dữ liệu form HTML.
- `viewEngine(app)`: dùng EJS, file view nằm ở đâu, file tĩnh nằm ở đâu
- `initWebRoutes(app)`: Gọi hàm để đăng ký các route cho ứng dụng. Nghĩa là từ đây server biết URL nào sẽ gọi controller nào.

## Bước 6: Tạo file web.js trong thư mục src\route

- `express.Router()` Tạo ra một đối tượng router để gom các route lại một chỗ, thay vì viết hết trong server.js.
- `router.get('/home', homeController.getHomePage);` nếu người dùng vào /home thì gọi hàm getHomePage trong homeController
- `return app.use("/", router);` gắn toàn bộ router này vào app, với đường dẫn gốc là /.

## Bước 7: Tạo file user.js trong thư mục src\models

- File `user.js` trong models là **model Sequelize** dùng để mô tả bảng users trong database dưới dạng code JavaScript. Hiểu đơn giản:trong MySQL bạn có bảng users, trong Node.js bạn cần một “bản đại diện” của bảng đó, file này chính là bản đại diện đó
- `"use strict"` Bật chế độ strict mode của JavaScript để code chặt chẽ hơn, tránh một số lỗi cú pháp và lỗi dùng biến.
- `modelName: "User"`: tên model trong code là User
- `tableName: "users"`: model này ánh xạ đến bảng users trong MySQL
- `return User;` trả model User ra ngoài để các file khác có thể dùng, ví dụ: db.User.create(...)

## Bước 8: Tạo file migration_create_user.js trong thư mục src\migration để tạo bảng trong Database

- File `migration_create_user.js` là file migration dùng để tạo bảng users trong database. Hiểu đơn giản: model mô tả bảng bằng code;còn migration là file ra lệnh cho database phải tạo bảng như thế nào
- `up(queryInterface, Sequelize)` Đây là hàm chạy khi bạn migrate lên, tức là khi bạn chạy: `npx sequelize-cli db:migrate` thì Sequelize sẽ gọi hàm `up()` để tạo bảng.
- `down(queryInterface, Sequelize)` nếu bạn chạy: `npx sequelize-cli db:migrate:undo` thì Sequelize gọi `down()` để xóa bảng users.

## Bước 9: Tạo file homeController.js trong thư mục src\controllers

## Bước 10: Tạo file .ejs trong thư mục src\views
