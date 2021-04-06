export default function (err) {
  const { messages, statusCode, isPredictableError } = err.extensions;

  if (isPredictableError) return { messages, statusCode };

  if (process.env.NODE_ENV === "production") {
    return {
      messages: [{ msg: "Something went wrong." }],
      statusCode: 500,
    };
  }

  return err;
}
