class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statuscode = 404;
  }
}

module.exports = {
  NotFoundError,
};
