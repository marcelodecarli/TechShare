import { Request, Response } from "express";
import { PedidoDoacaoRepository } from "../repositories/pedido-doacao-repository";
import { PedidoDoacao } from "../models/Eletronico";

export class PedidoDoacaoController {
    private readonly pedidoRepo: PedidoDoacaoRepository;

    constructor() {
        this.pedidoRepo = new PedidoDoacaoRepository();
    }

    async create(req: Request, res: Response) {
        const { tipoEletronico, nivelNecessidade, estado, cidade } = req.body;
        const comprovanteEscolar = req.file?.filename; // se estiver usando multer

        if (!tipoEletronico || !nivelNecessidade || !estado || !cidade) {
            res.status(400).json({ message: "Todos os campos obrigatórios devem ser preenchidos" });
            return;
        }

        try {
            const novoPedido = new PedidoDoacao(
                tipoEletronico,
                nivelNecessidade,
                estado,
                cidade,
                comprovanteEscolar
            );

            const pedidoCriado = await this.pedidoRepo.create(novoPedido);
            res.status(201).json(pedidoCriado);
            return;
        } catch (error) {
            res.status(500).json({ message: "Erro ao criar pedido", error });
            return;
        }
    }

    async getAll(req: Request, res: Response) {
        try {
            const pedidos = await this.pedidoRepo.findAll();
            res.status(200).json(pedidos);
            return;
        } catch (error) {
            res.status(500).json({ message: "Erro ao buscar pedidos", error });
            return;
        }
    }

    async getById(req: Request, res: Response) {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            res.status(400).json({ message: "ID inválido" });
            return;
        }

        try {
            const pedido = await this.pedidoRepo.findById(id);
            if (!pedido) {
                res.status(404).json({ message: "Pedido não encontrado" });
                return;
            }

            res.status(200).json(pedido);
            return;
        } catch (error) {
            res.status(500).json({ message: "Erro ao buscar pedido", error });
            return;
        }
    }

    async updatePartial(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        const updates = req.body;

        if (isNaN(id)) {
            res.status(400).json({ message: "ID inválido" });
            return;
        }

        try {
            const pedidoAtualizado = await this.pedidoRepo.updatePartial(id, updates);
            res.status(200).json(pedidoAtualizado);
            return;
        } catch (error) {
            res.status(500).json({ message: "Erro ao atualizar pedido", error });
            return;
        }
    }

    async delete(req: Request, res: Response) {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            res.status(400).json({ message: "ID inválido" });
            return;
        }

        try {
            await this.pedidoRepo.delete(id);
            res.status(204).send();
            return;
        } catch (error) {
            res.status(500).json({ message: "Erro ao deletar pedido", error });
            return;
        }
    }

    async getCurrentUser(req: Request, res: Response) {
        try {
            // O middleware authenticateToken já adicionou o usuário à requisição
            if (!req.user) {
                res.status(401).json({ message: "Não autenticado" });
                return;
            }

            // Retorna apenas os dados básicos do usuário que já estão no token
            const userData = {
                id: req.user.id,
                email: req.user.email
                // Adicione outros campos que estão no token se necessário
            };

            res.status(200).json(userData);
            return;

        } catch (error) {
            console.error('Erro ao buscar usuário atual:', error);
            res.status(500).json({ message: "Erro ao buscar usuário", error });
            return;
        }
    }
}