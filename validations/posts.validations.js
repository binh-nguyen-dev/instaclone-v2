import * as Joi from "joi";

const captionRule = Joi.string().empty().messages({
  "string.empty": `"caption" can not be a empty field`,
});

const photosRule = Joi.any();

export const createPostSchema = Joi.object({
  caption: captionRule,
  photos: photosRule,
});

export const editPostSchema = Joi.object({
  caption: captionRule,
});
