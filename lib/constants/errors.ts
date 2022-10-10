type ErrorConstant = {
  code: number;
  message: string;
};

export const USER_DOCUMENT_NOT_FOUND_ERROR: ErrorConstant = {
  code: 1,
  message: 'User not found',
};

export const USERNAME_ALREADY_EXISTS_ERROR: ErrorConstant = {
  code: 2,
  message: 'Username already exists',
};
