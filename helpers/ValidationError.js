import { ApolloError } from "apollo-server-errors";

class ValidationError extends ApolloError {
  constructor(messages, statusCode) {
    if (typeof messages === "string") {
      messages = [{ msg: messages }];
    }

    super("VALIDATION_ERROR_MESSAGES", "VALIDATION_ERROR_CODE", {
      messages,
      statusCode,
      isPredictableError: true,
    });
  }
}

export default ValidationError;
