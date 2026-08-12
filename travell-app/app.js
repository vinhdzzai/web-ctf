const express = require("express");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const searchRoutes = require("./routes/searchRoutes");
const flagRoutes = require("./routes/flagRoutes");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.redirect("/login.html");
});

app.get("/travel", (req, res) => {
  res.sendFile(
    require("path").join(__dirname, "views", "travel", "travel.html"),
  );
});

app.get("/travel/books", (req, res) => {
  res.sendFile(
    require("path").join(__dirname, "views", "travel", "books", "index.html"),
  );
});

// Endpoint to serve images from views/images folder
app.get("/image", (req, res) => {
  const fs = require("fs");
  const path = require("path");

  const imageName = req.query.img;
  if (!imageName) {
    return res.status(400).send("Missing img parameter");
  }

  const basePath = path.join(__dirname, "views", "images");
  const fullPath = basePath + "/" + imageName;

  fs.readFile(fullPath, (err, data) => {
    if (err) {
      return res.status(404).send("File not found: " + err.message);
    }

    const ext = path.extname(fullPath).toLowerCase();
    const mimeTypes = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".webp": "image/webp",
      ".svg": "image/svg+xml",
    };

    res.setHeader("Content-Type", mimeTypes[ext] || "application/octet-stream");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${path.basename(fullPath)}"`,
    );
    res.send(data);
  });
});

// Mount routes
app.use(authRoutes);
app.use(profileRoutes);
app.use(searchRoutes);
app.use(flagRoutes);

module.exports = app;
//Phần "Mount routes" là bước gắn các cụm route đã đóng gói sẵn (router) vào app thật, để app biết những route đó tồn tại và xử lý được khi có request khớp tới.
