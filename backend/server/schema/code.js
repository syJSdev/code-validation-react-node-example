import Joi from "joi";

export const code = Joi.string().pattern(/^\d{3,}$/, "Code");
export const codeRequired = code.required();
