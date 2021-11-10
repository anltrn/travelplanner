const jwt = require("jsonwebtoken");
const { db } = require("./mongodb");
const { jwtSecret } = require("./config");

const verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized Token!" });
    }
    req.userId = decoded.id;
    next();
  });
};


const checkDuplicateUsernameOrEmail = (req, res, next) => {
  db.user
    .findOne({
      username: req.body.username,
    })
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (user) {
        res
          .status(400)
          .send({ message: "Failed! Username is already taken!" });
        return;
      }

      db.user
        .findOne({
          email: req.body.email,
        })
        .exec((err, user) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          if (user) {
            res
              .status(400)
              .send({ message: "Failed! Email is already taken!" });
            return;
          }

          next();
        });
    });
};


module.exports = {
  verifyToken,
  checkDuplicateUsernameOrEmail,
  jwtSecret,
};
