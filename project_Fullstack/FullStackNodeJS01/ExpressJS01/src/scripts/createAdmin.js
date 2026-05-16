require("dotenv").config();
const readline = require("readline");
const bcrypt = require("bcrypt");
const connectDB = require("../config/database");
const User = require("../models/user");

const SALT_ROUNDS = 10;

const ask = (question) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer.trim());
        });
    });
};

(async () => {
    try {
        const name = process.argv[2] || await ask("Tên admin: ");
        const email = (process.argv[3] || await ask("Email admin: ")).toLowerCase();
        const password = process.argv[4] || await ask("Mật khẩu (tối thiểu 8 ký tự): ");

        if (!name || !email || !password) {
            console.log("Thiếu thông tin. Cách dùng:");
            console.log("  npm run create:admin -- \"Ten Admin\" admin@medcare.vn MatKhau123");
            process.exit(1);
        }

        if (password.length < 8) {
            console.log("Mật khẩu tối thiểu 8 ký tự.");
            process.exit(1);
        }

        await connectDB();

        const existing = await User.findOne({ email });
        if (existing) {
            existing.name = name;
            existing.password = await bcrypt.hash(password, SALT_ROUNDS);
            existing.role = "Admin";
            existing.isEmailVerified = true;
            await existing.save();
            console.log(`Đã cập nhật user ${email} thành Admin (đã kích hoạt email).`);
        } else {
            await User.create({
                name,
                email,
                password: await bcrypt.hash(password, SALT_ROUNDS),
                role: "Admin",
                isEmailVerified: true
            });
            console.log(`Đã tạo Admin: ${email}`);
        }

        console.log("Đăng nhập tại /login → chuyển tới /admin/profile");
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
})();
