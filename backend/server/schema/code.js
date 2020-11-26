import Joi from "joi";

export const code = Joi.string()
  .length(6)
  .pattern(/^\d{6}$/, { name: "numbers" });
export const codeRequired = code.required();
