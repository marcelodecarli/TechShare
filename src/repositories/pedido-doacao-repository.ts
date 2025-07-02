import { PedidoDoacao } from "../models/Eletronico";
import { AppDataSource } from "../config/data-source";
import { Repository } from "typeorm";

export class PedidoDoacaoRepository {
    private repository: Repository<PedidoDoacao>;

    constructor() {
        this.repository = AppDataSource.getRepository(PedidoDoacao);
    }

    async findById(id: number): Promise<PedidoDoacao | null> {
        return this.repository.findOne({ where: { id } });
    }

    async findAll(): Promise<PedidoDoacao[]> {
        return this.repository.find();
    }

    async create(pedido: PedidoDoacao): Promise<PedidoDoacao> {
        return this.repository.save(pedido);
    }

    async updatePartial(id: number, updates: Partial<PedidoDoacao>): Promise<PedidoDoacao> {
        const pedido = await this.repository.preload({ id, ...updates });

        if (!pedido) {
            throw new Error("Pedido não encontrado");
        }

        return this.repository.save(pedido);
    }

    async delete(id: number): Promise<void> {
        await this.repository.delete(id);
    }
}
