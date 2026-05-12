const path = require("path");
const exprss = require("express");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const app = exprss();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(cookieParser());
app.use(exprss.json());
app.use(exprss.urlencoded({ extended: true }));

const viewRoutes = require("./routes/viewRoutes");
const authRoutes = require("./routes/authRoutes");
app.use("/", viewRoutes);
app.use("/api/auth", authRoutes);


app.listen(3000, () => {
    console.log("Server running on port 3000");
});
