const cors = require("cors");
const dotenv = require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
let bodyParser = require("body-parser");
let { handleError } = require("./helpers/errorHandler");
const authRouter = require("./routes/authCreateRouter.js")();
const moodleRouter = require("./routes/moodleCreateRouter.js")();
const miscRouter = require("./routes/miscCreateRouter.js")();

//Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(cors());

//Connect to database
mongoose.connect(
  process.env.DB_URL,
  {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => console.log("[X] Connected to DB")
);

//Route Middlewares
app.use("/api/user", authRouter);
app.use("/api/moodle", moodleRouter);
app.use("/api/misc", miscRouter);

// Error handler
app.use(function (err, req, res, next) {
  handleError(err, res);
});
module.exports = app;
