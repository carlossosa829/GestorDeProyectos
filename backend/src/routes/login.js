const { Router } = require("express");
const router = Router();
const loginController = require("../controllers/login.controller");

router.post(
  "/login",
  loginController.validateUsuario,
  loginController.authenticateUser
);
router.get("/authorize", loginController.authorizeUser);

module.exports = router;
