const dotenv = require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
let bodyParser = require("body-parser");

//Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

//Importing routes
const authRoute = require("./routes/auth");

//Connect to database
mongoose.connect(
  process.env.DB_URL,
  {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  () => console.log("[X] Connected to DB")
);

//Route Middlewares
app.use("/api/user", authRoute);

app.listen(3000, () => console.log("[X] Server is running"));
