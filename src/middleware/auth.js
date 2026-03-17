import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Bad authentication token (no token)" });
  }

  jwt.verify(token, process.env.JWT_RANDOMISER, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        message: "Bad authentication token (invalid or expired token)",
      });
    }

    req.body = req.body || {};
    req.body.userId = decoded.userId;

    // Attach decoded data to req.user instead of req.body
    // req.user = {
    //   userId: decoded.userId,
    // };

    next();
  });
};

export default authUser;
