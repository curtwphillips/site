const router = require("express").Router();

const redirect = require("./redirect");
const todos = require("./todos");
const user = require("./user");

const auth = require("./middleware/auth");

router.get("/user/:id", user.find);
router.put("/user/:id", user.update);
router.delete("/user/:id", user.delete);

router.post("/register", user.register);
router.post("/login", user.login);
router.post("/logout", user.logout);

// todo: add auth middleware
router.get('/todos', todos.find);
router.delete('/todos/todo', todos.delete);
router.post('/todos/todo', todos.addTodo);
router.post('/todos/category', todos.addCategory);
router.put('/todos/todo', todos.updateTodo);

router.get("*", redirect.destination);

module.exports = router;