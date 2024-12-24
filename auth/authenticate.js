const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token)
    return res.status(401).json({ message: "Access denied! no token" });

  try {
    const verified = jwt.verify(token, `${process.env.SEC_KEY}`);

    req.user = verified;

    next();
  } catch (e) {
    res.status(400).json({ message: "Invalid token" });
  }
};

module.exports = authenticate;
