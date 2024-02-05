class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statuscode = 401;
  }
}

module.exports = {
  UnauthorizedError,
};
