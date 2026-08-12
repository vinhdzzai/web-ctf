const express = require("express");
const { register, login, logout } = require("../controllers/authController");

const router = express.Router();
//express.Router() tạo 1 object có API giống hệt app (app.get, app.post, app.put, app.delete, ...). Nó được sử dụng để tạo các route module riêng biệt.
// nhưng nó kh tự chạy được - chỉ là 1 cụm route đóng gói lại , phải đem gắn vào app.js mới chạy được

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

module.exports = router; //xuất các router ra ngoài
