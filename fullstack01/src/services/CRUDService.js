import bcrypt from "bcryptjs";
import db from "../models/index";
import { where } from "sequelize";

const salt = bcrypt.genSaltSync(10); // thuật toán hash password
let createNewUser = async (data) => {
  // hàm tạo user với tham số data
  return new Promise(async (resolve, reject) => {
    // dùng Promise đảm bảo luôn trả kết quả, trong xử lý đồng bộ
    try {
      let hashPasswordFromBcrypt = await hashUserPassword(data.password); // hash password trước khi lưu vào database
      await db.User.create({
        // tạo user mới trong database
        email: data.email,
        password: hashPasswordFromBcrypt,
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address,
        phoneNumber: data.phoneNumber,
        gender: data.gender === "1" ? true : false,
        roleId: data.roleId,
      });
      resolve("Ok create a new user succeed!"); // trả kết quả thành công
      // console.log('data from service');
      // console.log(data);
      // console.log(hashPasswordFromBcrypt);
    } catch (error) {
      reject(error);
    }
  });
};

let hashUserPassword = (password) => {
  // hàm hash password
  return new Promise(async (resolve, reject) => {
    try {
      let hashPassword = bcrypt.hashSync(password, salt); // hash password với thuật toán đã tạo ở trên
      resolve(hashPassword);
    } catch (error) {
      reject(error);
    }
  });
};

// lấy tất cả findAll CRUD
let getAllUser = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = db.User.findAll({
        raw: true,
      });
      resolve(users);
    } catch (error) {
      reject(error);
    }
  });
};

// lấy findOne CRUD
let getUserInfoById = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: userId },
        raw: true,
      });
      if (user) {
        resolve(user);
      } else {
        resolve([]);
      }
    } catch (error) {
      reject(error);
    }
  });
};

// hàm put CRUD
let updateUserData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: data.id },
      });
      if (user) {
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.address = data.address;
        await user.save();
        let allUsers = await db.User.findAll();
        resolve(allUsers);
      } else {
        resolve();
      }
    } catch (error) {
      reject(error);
    }
  });
};

// hàm xóa user
let deleteUserById = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: userId },
      });
      if (user) {
        await user.destroy();
      }
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  createNewUser: createNewUser,
  getAllUser: getAllUser,
  getUserInfoById: getUserInfoById,
  updateUserData: updateUserData,
  deleteUserById: deleteUserById,
};
