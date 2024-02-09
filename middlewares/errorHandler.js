const handleServerError = (err, req, res, next) => {
  const { statuscode = 500, message } = err;
  res.status(statuscode).send({
    message: statuscode === 500 ? "An error occurred on the server" : message,
  });
};

module.exports = {
  handleServerError,
};
