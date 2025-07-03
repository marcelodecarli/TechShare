import { Request, Response } from "express";
import { PessoaFisica } from "../models/PessoaFisica";
import { PessoaFisicaRepository } from "../repositories/pessoaFisica-repository";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as jwt.Secret;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables");
}

export class PessoaFisicaController {
    private readonly pessoaFisicaRepo: PessoaFisicaRepository;

    constructor() {
        this.pessoaFisicaRepo = new PessoaFisicaRepository();
    }

    async login(req: Request, res: Response) {
        const { email, senha } = req.body;

        if (!email || !senha) {
             res.status(400).json({ message: "Email e senha são obrigatórios" });
             return
        }

        try {
            const user = await this.pessoaFisicaRepo.findByEmail(email);
            if (!user) {
                 res.status(401).json({ message: "Email ou senha inválidos" });
                 return
            }

            const isPasswordValid = await bcrypt.compare(senha, user.senha);
            if (!isPasswordValid) {
                 res.status(401).json({ message: "Email ou senha inválidos" });
                 return
            }

            const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });

            res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "lax",
            });
            res.status(200).json({ message: "Login realizado com sucesso" });
            return 

        } catch (error) {
             res.status(500).json({ message: "Erro ao realizar login", error });
             return
        }
    }

    async logout(req: Request, res: Response) {
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
        });

         res.status(200).json({ message: "Logout realizado com sucesso" });
         return
    }

    async getAllUsers(req: Request, res: Response) {
        try {
            const users = await this.pessoaFisicaRepo.findAll();
             res.status(200).json(users);
             return
        } catch (error) {
             res.status(500).json({ message: "Erro ao buscar usuários", error });
             return
        }
    }

    async getUserById(req: Request, res: Response) {
        const userId = parseInt(req.params.id);
        if (isNaN(userId)) {
             res.status(400).json({ message: "ID inválido" });
             return
        }

        try {
            const user = await this.pessoaFisicaRepo.findById(userId);
            if (!user) {
                 res.status(404).json({ message: "Usuário não encontrado" });
                 return
            }

             res.status(200).json(user);
             return
        } catch (error) {
             res.status(500).json({ message: "Erro ao buscar usuário", error });
             return
        }
    }

    async getUserByEmail(req: Request, res: Response) {
        const email = req.params.email;

        try {
            const user = await this.pessoaFisicaRepo.findByEmail(email);
            if (!user) {
                 res.status(404).json({ message: "Usuário não encontrado" });
                 return
            }

             res.status(200).json(user);
             return
        } catch (error) {
             res.status(500).json({ message: "Erro ao buscar usuário por email", error });
             return
        }
    }

    async createUser(req: Request, res: Response) {
        const { email, nome, cpf, telefone, dataNascimento, senha } = req.body;

        if (!email || !nome || !cpf || !telefone || !dataNascimento || !senha) {
             res.status(400).json({ message: "Todos os campos são obrigatórios" });
             return
        }

        try {
            const existingUser = await this.pessoaFisicaRepo.findByEmail(email);
            if (existingUser) {
                 res.status(409).json({ message: "Usuário já existe" });
                 return
            }

            const hashedSenha = await bcrypt.hash(senha, 10);
            const newUser = new PessoaFisica(email, nome, cpf, telefone, new Date(dataNascimento), hashedSenha);

            const createdUser = await this.pessoaFisicaRepo.create(newUser);
             res.status(201).json(createdUser);
             return

        } catch (error) {
          console.error("Erro ao criar usuário:", error);
             res.status(500).json({ message: "Erro ao criar usuário", error });
             return
        }
    }

    async updatePartialUser(req: Request, res: Response) {
        const userId = parseInt(req.params.id);
        const updates = req.body;

        if (isNaN(userId)) {
             res.status(400).json({ message: "ID inválido" });
             return
        }

        try {
            const existingUser = await this.pessoaFisicaRepo.findById(userId);
            if (!existingUser) {
                 res.status(404).json({ message: "Usuário não encontrado" });
                 return
            }

            if (updates.senha) {
                updates.senha = await bcrypt.hash(updates.senha, 10);
            }

            const updatedUser = await this.pessoaFisicaRepo.updatePartial(userId, updates);
             res.status(200).json(updatedUser);
             return

        } catch (error) {
             res.status(500).json({ message: "Erro ao atualizar usuário", error });
             return
        }
    }

    async deleteUser(req: Request, res: Response) {
        const userId = parseInt(req.params.id);
        if (isNaN(userId)) {
             res.status(400).json({ message: "ID inválido" });
             return
        }

        try {
            const existingUser = await this.pessoaFisicaRepo.findById(userId);
            if (!existingUser) {
                 res.status(404).json({ message: "Usuário não encontrado" });
                 return
            }

            await this.pessoaFisicaRepo.delete(userId);
             res.status(204).send();
             return

        } catch (error) {
             res.status(500).json({ message: "Erro ao deletar usuário", error });
             return
        }
    }
}
