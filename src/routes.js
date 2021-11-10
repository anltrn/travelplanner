const {
  checkDuplicateUsernameOrEmail,
  verifyToken,
} = require("./middlewares");

const authController = require("./auth.controller");
const planController = require("./plan.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/sign-up",
    [checkDuplicateUsernameOrEmail],
    authController.signUp
  );

  app.post("/sign-in", authController.signIn);

  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/set-budget", [verifyToken], planController.setBudget);
  app.post("/generate-plan", [verifyToken], planController.generatePlan);
};
