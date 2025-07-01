import { Request, Response } from "express";
import { UserRepository } from "../repositories/user-repository";
import { User } from "../models/User";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as jwt.Secret;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables");
}

export class UserController {
    private readonly userRepo: UserRepository;

    constructor() {
        this.userRepo = new UserRepository();
    }

    async login(req: Request, res: Response) {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: "Email and password are required" });
            return;
        }

        try {
            const user = await this.userRepo.findByEmail(email);

            if (!user) {
                res.status(401).json({ message: "Invalid email or password" });
                return;
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                res.status(401).json({ message: "Invalid email or password" });
                return;
            }

            const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });

            // Salva o token no cookie
            res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "lax",
            });

            res.status(200).json({ message: "Login successful" });
            return;

        } catch (error) {
            res.status(500).json({ message: "Error logging in", error });
            return;
        }
    }

    // Logout user
    async logout(req: Request, res: Response) {
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
        });

        res.status(200).json({ message: "Logout successful" });
    }

    // Get all users
    async getAllUsers(req: Request, res: Response) {
        try {
            const users = await this.userRepo.findAll();
            res.status(200).json(users);
            return;
        } catch (error) {
            res.status(500).json({ message: "Error fetching users", error });
            return;
        }
    }

    // Get user by ID
    async getUserById(req: Request, res: Response) {
        const userId = parseInt(req.params.id);

        if (isNaN(userId)) {
            res.status(400).json({ message: "Invalid user ID" });
            return;
        }

        try {
            const user = await this.userRepo.findById(userId);
            if (!user) {
                res.status(404).json({ message: "User not found" });
                return;
            }
            res.status(200).json(user);
            return;
        } catch (error) {
            res.status(500).json({ message: "Error fetching user", error });
            return;
        }
    }

    // Get user by email
    async getUserByEmail(req: Request, res: Response) {
        const email = req.params.email;

        if (!email) {
            res.status(400).json({ message: "Email is required" });
            return;
        }

        try {
            const user = await this.userRepo.findByEmail(email);
            if (!user) {
                res.status(404).json({ message: "User not found" });
                return;
            }
            res.status(200).json(user);
            return;
        } catch (error) {
            res.status(500).json({ message: "Error fetching user", error });
            return;
        }
    }

    // Create new user
    async createUser(req: Request, res: Response) {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: "Email, and password are required" });
            return;
        }

        try {
            const existingUser = await this.userRepo.findByEmail(email);

            if (existingUser) {
                res.status(409).json({ message: "User already exists" });
                return;
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User(email, hashedPassword);

            const createdUser = await this.userRepo.create(newUser);
            res.status(201).json(createdUser);
            return;

        } catch (error) {
            res.status(500).json({ message: "Error creating user", error: error instanceof Error ? error.message : String(error) });
            return;
        }
    }

    // update partial user
    async updatePartialUser(req: Request, res: Response) {
        const userId = parseInt(req.params.id);
        const partialUser = req.body;

        if (isNaN(userId)) {
            res.status(400).json({ message: "Invalid user ID" });
            return;
        }

        try {
            const existingUser = await this.userRepo.findById(userId);

            if (!existingUser) {
                res.status(404).json({ message: "User not found" });
                return;
            }

            if (partialUser.password) {
                partialUser.password = await bcrypt.hash(partialUser.password, 10);
            }

            const updatedUser = await this.userRepo.updatePartial(userId, partialUser);
            res.status(200).json(updatedUser);
            return;

        } catch (error) {
            res.status(500).json({ message: "Error updating user", error });
            return;
        }
    }

    // Delete user by ID
    async deleteUser(req: Request, res: Response) {
        const userId = parseInt(req.params.id);

        if (isNaN(userId)) {
            res.status(400).json({ message: "Invalid user ID" });
            return;
        }

        try {
            const existingUser = await this.userRepo.findById(userId);

            if (!existingUser) {
                res.status(404).json({ message: "User not found" });
                return;
            }

            await this.userRepo.delete(userId);
            res.status(204).send();
            return;

        } catch (error) {
            res.status(500).json({ message: "Error deleting user", error });
            return;
        }
    }
}
