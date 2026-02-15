/**
 *
 * @param value password value
 * @returns error message if password is invalid, empty string if valid
 */
export const passwordValidation = (value: string): string => {
  if (value.length < 6) {
    return "Password must be 6 characters or more";
  }

  if ((value.match(/[A-Z]/g) || []).length < 1) {
    return "Password needs at least 1 uppercase letter";
  }

  if ((value.match(/[a-z]/g) || []).length < 1) {
    return "Password needs at least 1 lowercase letter";
  }

  if ((value.match(/[0-9]/g) || []).length < 1) {
    return "Password needs at least 1 number";
  }

  if ((value.match(/[^a-z]/gi) || []).length < 1) {
    return "Password needs at least 1 symbol";
  }

  return "";
};
