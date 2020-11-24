import express from "express";
import Joi from "joi";
import { codesRequired } from "../schema/code";
import createError from "http-errors";

const router = express.Router();

router.post("/validate", (req, res, next) => {
  try {
    const validationResult = Joi.object().keys({ codes: codesRequired }).validate(req.body);
    if(validationResult.error) throw validationResult.error
    if (parseInt(req.body.codes[req.body.codes.length - 1], 10) === 7) {
      return next(createError(400, new Error("Invalid code")));
    }
    return res.status(200).send({ message: "Validation success" });
  } catch (error) {
    return next(createError(400, error));
  }
});

export default router;