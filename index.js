const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const multer = require("multer");
const cors = require("cors");

const { registerValidation, loginValidation } = require("./validations/auth");
const { postCreateValidation } = require("./validations/post");
const handleValidationErrors = require("./utils/handleValidationErrors");
const checkAuth = require("./utils/checkAuth");
const UserController = require("./controllers/UserController");
const PostController = require("./controllers/PostController");

dotenv.config();
const PORT = process.env.PORT || 4444;
const MONGO_URI = process.env.MONGO_URI;
const app = express();
const storage = multer.diskStorage({
  destination: (_, __, callback) => {
    callback(null, "uploads");
  },
  filename: (_, file, callback) => {
    callback(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use("uploads", express.static("uploads"));
app.use(cors());

mongoose.set("strictQuery", false);
mongoose
  .connect(MONGO_URI, {})
  .then(() => console.log("db " + "ok"))
  .catch((error) => console.log(error));

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.post(
  "/auth/register",
  registerValidation,
  handleValidationErrors,
  UserController.register
);
app.post(
  "/auth/login",
  loginValidation,
  handleValidationErrors,
  UserController.login
);
app.get("/auth/me", checkAuth, UserController.getMe);

app.get("/posts", PostController.getAll);
app.get("/posts/:id", PostController.getOne);
app.post(
  "/posts",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.create
);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch(
  "/posts/:id",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.update
);

app.listen(PORT, () => console.log(`Server: ${PORT}`));
