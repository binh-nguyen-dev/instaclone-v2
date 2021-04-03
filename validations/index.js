import ValidationError from "#root/helpers/ValidationError.js";

const runValidation = async (schema, data) => {
  const result = await schema.validate(data, {
    abortEarly: false,
  });

  processResult(result);
};

function processResult(result) {
  if (!result.error) return;

  const messages = result.error.details.map(({ message, path }) => ({
    msg: message,
    field: path[0],
  }));

  throw new ValidationError(messages, 400);
}

export default runValidation;
