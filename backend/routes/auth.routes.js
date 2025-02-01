const { loginAuth, refresh, forgotPassword, resetPassword, updatePassword } = require("../controllers/auth.controller");
const verifyToken = require("../middleware/auth.middleware");

const AuthRouter = require("express").Router();

AuthRouter.post("/user", loginAuth);
AuthRouter.get("/refresh", refresh);

AuthRouter.post('/forgot-password', forgotPassword)
AuthRouter.post('/reset-password', resetPassword)
AuthRouter.put('/update-password', updatePassword)

module.exports = AuthRouter;