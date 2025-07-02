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
            return res.status(400).json({ message: "Todos os campos obrigatórios devem ser preenchidos" });
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
            return res.status(201).json(pedidoCriado);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao criar pedido", error });
        }
    }

    async getAll(req: Request, res: Response) {
        try {
            const pedidos = await this.pedidoRepo.findAll();
            return res.status(200).json(pedidos);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao buscar pedidos", error });
        }
    }

    async getById(req: Request, res: Response) {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "ID inválido" });
        }

        try {
            const pedido = await this.pedidoRepo.findById(id);
            if (!pedido) {
                return res.status(404).json({ message: "Pedido não encontrado" });
            }

            return res.status(200).json(pedido);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao buscar pedido", error });
        }
    }

    async updatePartial(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        const updates = req.body;

        if (isNaN(id)) {
            return res.status(400).json({ message: "ID inválido" });
        }

        try {
            const pedidoAtualizado = await this.pedidoRepo.updatePartial(id, updates);
            return res.status(200).json(pedidoAtualizado);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao atualizar pedido", error });
        }
    }

    async delete(req: Request, res: Response) {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "ID inválido" });
        }

        try {
            await this.pedidoRepo.delete(id);
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ message: "Erro ao deletar pedido", error });
        }
    }
}
