const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const { connectmongo } = require("./connection");
const {checkauthorization,restrictTo}= require("./middleware/auth");
const session = require("express-session");


const Url = require("./models/url");

const urlRouter = require("./routes/url");
const staticRouter = require("./routes/static");
const userRouter = require("./routes/user");

const app = express();
const PORT = 8001;




app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use(
  session({
    secret: "mysecretkey",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(checkauthorization);

app.use("/uploads", express.static("uploads"));

const User = require("./models/user");

app.use(async (req, res, next) => {
  if (!req.session.user) {
    res.locals.user = null;
    return next();
  }

  // ALWAYS get fresh user from DB
  const freshUser = await User.findById(req.session.user._id);
  res.locals.user = freshUser;

  next();
});


app.set("view engine","ejs");
app.set("views", path.resolve("./views"));

app.use("/url",restrictTo(["USER", "ADMIN"]), urlRouter);    
app.use("/user", userRouter);
app.use("/",checkauthorization,staticRouter);

connectmongo("mongodb://localhost:27017/urlshorter");

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
