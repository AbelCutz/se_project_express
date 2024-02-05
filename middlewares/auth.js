const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("./errorHandler");

const authMiddleware = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new UnauthorizedError("Authorization required");
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === "production" ? JWT_SECRET : "dev-secret"
    );
  } catch (err) {
    throw new UnauthorizedError("Authorization required");
  }

  req.user = payload;
  return next();
};

module.exports = authMiddleware;
