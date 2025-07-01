import { Router } from "express";
import { UserController } from "../controllers/user-controller";
import { authenticateToken } from "../middlewares/auth-middleware";

const userController = new UserController();
const router = Router();

// Define the routes for user operations
router.post("/login", userController.login.bind(userController)); // Login route
router.post("/logout", userController.logout.bind(userController)); // Logout route
router.post("/register", userController.createUser.bind(userController)); // Register route

router.get("/users", authenticateToken, userController.getAllUsers.bind(userController)); // Get all users route
router.get("/users/:id", authenticateToken, userController.getUserById.bind(userController)); // Get user by ID route
router.get("/users/email/:email", authenticateToken, userController.getUserByEmail.bind(userController)); // Get user by email route
router.patch("/users/:id", authenticateToken, userController.updatePartialUser.bind(userController)); // Update user route
router.delete("/users/:id", authenticateToken, userController.deleteUser.bind(userController)); // Delete user route

export default router;
