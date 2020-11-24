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
app.use(morgan("combined", {
  skip: (req, res) => {
    return req.app.get("env") === "test";
  },
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../public")));

// routing
app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  if (req.app.get("env") !== "test") {
    console.log(err);
  }

  let errorMsg = "Caught some errors";
  if (req.app.get("env") === "development" || err.status < 500) {
    // 404, 400,
    errorMsg = err.message;
  }

  res.status(err.status || 500).send({ errorMsg });
});

export default app;
