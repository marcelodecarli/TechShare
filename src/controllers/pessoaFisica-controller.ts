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
            return res.status(400).json({ message: "Email e senha são obrigatórios" });
        }

        try {
            const user = await this.pessoaFisicaRepo.findByEmail(email);
            if (!user) {
                return res.status(401).json({ message: "Email ou senha inválidos" });
            }

            const isPasswordValid = await bcrypt.compare(senha, user.senha);
            if (!isPasswordValid) {
                return res.status(401).json({ message: "Email ou senha inválidos" });
            }

            const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });

            res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "lax",
            });

            return res.status(200).json({ message: "Login realizado com sucesso" });

        } catch (error) {
            return res.status(500).json({ message: "Erro ao realizar login", error });
        }
    }

    async logout(req: Request, res: Response) {
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
        });

        return res.status(200).json({ message: "Logout realizado com sucesso" });
    }

    async getAllUsers(req: Request, res: Response) {
        try {
            const users = await this.pessoaFisicaRepo.findAll();
            return res.status(200).json(users);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao buscar usuários", error });
        }
    }

    async getUserById(req: Request, res: Response) {
        const userId = parseInt(req.params.id);
        if (isNaN(userId)) {
            return res.status(400).json({ message: "ID inválido" });
        }

        try {
            const user = await this.pessoaFisicaRepo.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "Usuário não encontrado" });
            }

            return res.status(200).json(user);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao buscar usuário", error });
        }
    }

    async getUserByEmail(req: Request, res: Response) {
        const email = req.params.email;

        try {
            const user = await this.pessoaFisicaRepo.findByEmail(email);
            if (!user) {
                return res.status(404).json({ message: "Usuário não encontrado" });
            }

            return res.status(200).json(user);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao buscar usuário por email", error });
        }
    }

    async createUser(req: Request, res: Response) {
        const { email, nome, cpf, telefone, dataNascimento, senha } = req.body;

        if (!email || !nome || !cpf || !telefone || !dataNascimento || !senha) {
            return res.status(400).json({ message: "Todos os campos são obrigatórios" });
        }

        try {
            const existingUser = await this.pessoaFisicaRepo.findByEmail(email);
            if (existingUser) {
                return res.status(409).json({ message: "Usuário já existe" });
            }

            const hashedSenha = await bcrypt.hash(senha, 10);
            const newUser = new PessoaFisica(email, nome, cpf, telefone, new Date(dataNascimento), hashedSenha);

            const createdUser = await this.pessoaFisicaRepo.create(newUser);
            return res.status(201).json(createdUser);

        } catch (error) {
            return res.status(500).json({ message: "Erro ao criar usuário", error });
        }
    }

    async updatePartialUser(req: Request, res: Response) {
        const userId = parseInt(req.params.id);
        const updates = req.body;

        if (isNaN(userId)) {
            return res.status(400).json({ message: "ID inválido" });
        }

        try {
            const existingUser = await this.pessoaFisicaRepo.findById(userId);
            if (!existingUser) {
                return res.status(404).json({ message: "Usuário não encontrado" });
            }

            if (updates.senha) {
                updates.senha = await bcrypt.hash(updates.senha, 10);
            }

            const updatedUser = await this.pessoaFisicaRepo.updatePartial(userId, updates);
            return res.status(200).json(updatedUser);

        } catch (error) {
            return res.status(500).json({ message: "Erro ao atualizar usuário", error });
        }
    }

    async deleteUser(req: Request, res: Response) {
        const userId = parseInt(req.params.id);
        if (isNaN(userId)) {
            return res.status(400).json({ message: "ID inválido" });
        }

        try {
            const existingUser = await this.pessoaFisicaRepo.findById(userId);
            if (!existingUser) {
                return res.status(404).json({ message: "Usuário não encontrado" });
            }

            await this.pessoaFisicaRepo.delete(userId);
            return res.status(204).send();

        } catch (error) {
            return res.status(500).json({ message: "Erro ao deletar usuário", error });
        }
    }
}
