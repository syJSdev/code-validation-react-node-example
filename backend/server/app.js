import express from "express";
import dotenv from "dotenv";
import createError from "http-errors";
import cors from "cors";
import morgan from "morgan";
import path from "path";

import indexRouter from "./route/index";

dotenv.config();

const app = express();

// cors
app.use(cors());

// logging
app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../public")));

// routing
app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  let message = "Caught some errors";
  if (req.app.get("env") === "development" || err.status < 500) {
    // 404, 400,
    message = err.message;
  }

  console.log(err);

  res.status(err.status || 500).send({ message });
});

export default app;
