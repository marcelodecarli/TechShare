import { Router } from "express";
import { PessoaFisicaController } from "../controllers/pessoaFisica-controller";
import { authenticateToken } from "../middlewares/auth-middleware";

const pessoaFisicaController = new PessoaFisicaController();
const router = Router();

// Define the routes for user operations
router.post("/login", pessoaFisicaController.login.bind(pessoaFisicaController)); // Login route
router.post("/logout", pessoaFisicaController.logout.bind(pessoaFisicaController)); // Logout route
router.post("/register", pessoaFisicaController.createUser.bind(pessoaFisicaController)); // Register route

router.get("/users", authenticateToken, pessoaFisicaController.getAllUsers.bind(pessoaFisicaController)); // Get all users route
router.get("/users/:id", authenticateToken, pessoaFisicaController.getUserById.bind(pessoaFisicaController)); // Get user by ID route
router.get("/users/email/:email", authenticateToken, pessoaFisicaController.getUserByEmail.bind(pessoaFisicaController)); // Get user by email route
router.patch("/users/:id", authenticateToken, pessoaFisicaController.updatePartialUser.bind(pessoaFisicaController)); // Update user route
router.delete("/users/:id", authenticateToken, pessoaFisicaController.deleteUser.bind(pessoaFisicaController)); // Delete user route

export default router;
