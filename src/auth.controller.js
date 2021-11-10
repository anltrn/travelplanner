const { db } = require("./mongodb");
const { jwtSecret } = require("./middlewares");
const { jwtTokenExpiration } = require("./config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const signUp = (req, res) => {
  const user = new db.user({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
      res.send({ message: "User successfully registered!" });
    
  });
};

const signIn = (req, res) => {
  db.user
    .findOne({
      username: req.body.username,
    })
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      const token = jwt.sign({ id: user.id }, jwtSecret, {
        expiresIn: jwtTokenExpiration,
      });

      res.status(200).send({
        accessToken: token,
      });
    });
};

module.exports = {
  signIn,
  signUp,
};
