import express from 'express'; // == var express = require('express');

// js theo ES6
let configViewEngine = (app) => {
    app.use(express.static('./src/public')); // cấu hình đường dẫn tĩnh chứa images, css,...
    app.set("view engine", "ejs"); // cấu hình sử dụng EJS làm view engine
    app.set("views", "./src/views"); // cấu hình đường dẫn chứa file view
}
module.exports = configViewEngine; // xuất hàm ra 