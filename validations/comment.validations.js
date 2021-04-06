import * as Joi from "joi";

const contentRule = Joi.string().empty().messages({
  "string.content": `"content" can not be an empty field`,
});

export const createCommentSchema = Joi.object({
  content: contentRule,
});
