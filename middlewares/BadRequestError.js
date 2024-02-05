class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statuscode = 400;
  }
}

module.exports = {
  BadRequestError,
};
