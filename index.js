require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");

const { checkauthorization, restrictTo } = require("./middleware/auth");

const urlRouter = require("./routes/url");
const staticRouter = require("./routes/static");
const userRouter = require("./routes/user");

const User = require("./models/user");

const app = express();
const PORT = process.env.PORT || 8001;

/* -------------------- MIDDLEWARES -------------------- */
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

app.use("/uploads", express.static("uploads"));

/* -------------------- AUTH MIDDLEWARE -------------------- */
app.use(checkauthorization);

app.use(async (req, res, next) => {
  if (!req.session.user) {
    res.locals.user = null;
    return next();
  }

  try {
    const freshUser = await User.findById(req.session.user._id);
    res.locals.user = freshUser;
  } catch (err) {
    res.locals.user = null;
  }

  next();
});

/* -------------------- VIEW ENGINE -------------------- */
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

/* -------------------- ROUTES -------------------- */
app.use("/url", restrictTo(["USER", "ADMIN"]), urlRouter);
app.use("/user", userRouter);
app.use("/", staticRouter);

/* -------------------- DATABASE + SERVER START -------------------- */

console.log("MONGO_URL exists:", !!process.env.MONGO_URL);

// IMPORTANT: disable buffering
mongoose.set("bufferCommands", false);

mongoose
  .connect(process.env.MONGO_URL, {
    dbName: "urlshorter",
  })
  .then(() => {
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
  });
