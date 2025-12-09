import { BadRequestError } from "../libs/error/HttpErrors";

/**
 * Validate email address
 * @param {string} value
 * @returns {boolean} verified
 */
export const emailValidator = (value) => {
  return (
    typeof value === "string" &&
    String(value)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
  );
};

/**
 * Verify password
 * @param {string} password
 * @returns {boolean} isVerified
 */
export const verifyPassword = (password) => {
  const minLength = 6;
  const uppercaseRegex = /[A-Z]/;
  const lowercaseRegex = /[a-z]/;
  const numbersRegex = /[0-9]/;
  const specialCharsRegex = /[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]/;

  if (password.length < minLength) {
    throw new BadRequestError("Password must contains at least 6 characters");
  }

  if (!uppercaseRegex.test(password)) {
    throw new BadRequestError("Password must contains uppercase characters");
  }

  if (!lowercaseRegex.test(password)) {
    throw new BadRequestError("Password must contains lowercase characters");
  }

  if (!numbersRegex.test(password)) {
    throw new BadRequestError("Password must contains numbers");
  }

  if (!specialCharsRegex.test(password)) {
    throw new BadRequestError(
      "Password must contains symbols. Example: @#$%^&*"
    );
  }
  return true;
};

/**
 * Handle mongo validation error on catch
 * @param {object} error
 * @returns error
 */
export const handleMongoValidationError = (error) => {
  if (error?.name === "ValidationError" && typeof error?.errors === "object") {
    let errors = "";

    Object.keys(error.errors).forEach((key, index) => {
      errors += `${(index !== 0 && ", ") || ""}${error.errors[key].message}`;
    });
    let errorData = new BadRequestError(errors);
    return errorData;
  }

  return error;
};
