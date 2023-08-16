// user route
const Router = require("express");
const route = new Router();
const todoController = require("../controllers/TodoController");
const authenticateUser = require("../security/authenticateUser");

// Add the authentication middleware to the /users route
route.get("/todos/:id", authenticateUser, todoController.getTodosById);
route.post("/todos", authenticateUser, todoController.postTodo);
route.put("/todos/:id", authenticateUser, todoController.updateTodoById);
route.delete("/todos/:id", authenticateUser, todoController.deleteTodo);

module.exports = route;
