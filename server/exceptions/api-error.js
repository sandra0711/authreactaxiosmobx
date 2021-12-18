module.exports = class MyError extends Error {
  status;
  errors;

  constructor(status, message, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  };

  static UnauthorizedError() {
    return new MyError(401, 'Пользователь не авторизован');
  };

  static BadRequest(message, errors = []) {
    return new MyError(400, message, errors);
  };
};
