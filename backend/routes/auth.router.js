// user route
const Router = require("express");
const route = new Router();
const authController = require("../controllers/AuthController");
const authenticateUser = require("../security/authenticateUser");

// Add the authentication middleware to the /users route
route.post("/users/register", authController.register);
route.post("/users/login", authController.login);
route.get("/users/me", authenticateUser, authController.getUser);

module.exports = route;
