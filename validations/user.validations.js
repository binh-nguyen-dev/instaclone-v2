import * as Joi from "joi";

// require and type of each field have validated by application schema.
const firstNameRule = Joi.string().empty().messages({
  "string.empty": `"firstName" can not be an empty field`,
});

const lastNameRule = Joi.string().empty().messages({
  "string.empty": `"lastName" can not be an empty field`,
});

const usernameRule = Joi.string().empty().min(3).max(20).messages({
  "string.empty": `"username" can not be an empty field`,
  "string.min": `"username" should have a minimum length of {#limit}`,
  "string.max": `"username" should have a maximum length of {#limit}`,
});

const emailRule = Joi.string().empty().email().messages({
  "string.empty": `"email" can not be an empty field`,
  "string.email": `Please provide a valid email`,
});

const passwordRule = Joi.string().empty().min(8).messages({
  "string.empty": `"password" can not be an empty field`,
  "string.min": `"password" should have a minimum length of {#limit}`,
});

const bioRule = Joi.string().empty().messages({
  "string.empty": `"bio" can not be an empty field`,
});

export const createAccountSchema = Joi.object({
  firstName: firstNameRule,
  lastName: lastNameRule,
  username: usernameRule,
  email: emailRule,
  password: passwordRule,
});

export const editProfileSchema = Joi.object({
  firstName: firstNameRule,
  lastName: lastNameRule,
  username: usernameRule,
  email: emailRule,
  bio: bioRule,
});
