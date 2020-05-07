const Router = require("express").Router;
const { verifyJwt } = require("../../helpers/verifyToken");
const { ErrorHandler } = require("../../helpers/errorHandler");
const User = require("../../models/User");
const userSerivce = require("../../services/user.service")();
const path = require("path");
const multer = require("multer");
const date = Date.now();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../files"));
  },
  filename: function (req, file, cb) {
    cb(null, date + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new ErrorHandler(422, "File extension not allowed"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

const router = Router({
  mergeParams: true,
});

router.post(
  "/upload/image",
  verifyJwt,
  upload.single("userImage"),
  async (req, res) => {
    let user = await userSerivce.fetchUserByID(req.decodedToken._id);
    user.userImage = "http://localhost:3000/files/" + date + req.file.filename;
    await user.save();
    return res.status(200).send({
      success: true,
      message: "Image uploaded !",
    });
  }
);

router.get("/fetch/image", verifyJwt, async (req, res) => {
  let user = await userSerivce.fetchUserByID(req.decodedToken._id);
  let imgUrl = user.userImage;
  if (imgUrl) {
    return res.status(200).send({
      success: true,
      imgUrl,
    });
  }
  return res.status(404).send({
    success: false,
    message: "Image not Found !",
  });
});

module.exports = router;
