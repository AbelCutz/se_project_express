const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { ERROR_401 } = require("../utils/errors");

const authMiddleware = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(ERROR_401)
      .json({ message: "Unauthorized: Missing or invalid token" });
  }

  const token = authorization.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    req.user = payload;
    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(ERROR_401)
        .json({ message: "Unauthorized: Token has expired" });
    }
    return res
      .status(ERROR_401)
      .json({ message: "Unauthorized: Invalid token" });
  }
};

module.exports = authMiddleware;
