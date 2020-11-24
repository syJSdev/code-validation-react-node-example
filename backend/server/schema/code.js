import Joi from "joi";

export const code = Joi.number().integer().min(0).max(9).required();

export const codes = Joi.array().items(code).length(6);
export const codesRequired = codes.required();
