import express from "express"; // nạp express
import bodyParser from "body-parser"; // nạp body-parser lấy tham số từ client /user?id=7
import viewEngine from "./config/viewEngine"; // nạp cấu hình view engine
import initWebRoutes from "./route/web"; // nạp cấu hình web route
import connectDB from "./config/configdb"; // nạp cấu hình kết nối database

require("dotenv").config(); // gọi hàm config của dotenv để chạy lệnh process.env.PORT

let app = express();

// config app
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

viewEngine(app); // cấu hình view engine cho ứng dụng
initWebRoutes(app); // cấu hình web route cho ứng dụng
connectDB(); // kết nối database

let port = process.env.PORT || 6969; // nếu có PORT trong file .env thì lấy PORT đó, nếu không có thì lấy 6969
app.listen(port, () => {
  console.log("Backend Nodejs is running on the port: " + port);
});
