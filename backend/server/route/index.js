import express from "express";
import Joi from "joi";
import { codeRequired } from "../schema/code";
import createError from "http-errors";

const router = express.Router();

router.post("/validate", (req, res, next) => {
  try {
    const validationResult = Joi.object().keys({ code: codeRequired }).validate(req.body);
    if(validationResult.error) throw validationResult.error
    if (parseInt(req.body.code[req.body.code.length - 1], 10) === 7) {
      return next(createError(400, new Error("Invalid code")));
    }
    return res.status(200).send({ message: "Validation success" });
  } catch (error) {
    return next(createError(400, error));
  }
});

export default router;