class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statuscode = 403;
  }
}

module.exports = {
  ForbiddenError,
};
