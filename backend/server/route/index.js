import express from "express";
import Joi from "joi";
import { codesRequired } from "../schema/code";
import { getErrorMessageFromJoiError } from "../utils/index";

const router = express.Router();

router.post("/validate", (req, res) => {
  const validationResult = Joi.validate(req.body, Joi.object().keys({ codes: codesRequired }));
  if (validationResult.error) {
    return res.status(400).send({ success: false, message: getErrorMessageFromJoiError(validationResult.error) });
  }
  if (req.body.codes[5] !== 7) {
    return res.status(400).send({ success: false, message: "Invalid code" });
  }
  return res.status(200).send({ success: true, message: "Validation success" });
});

export default router;