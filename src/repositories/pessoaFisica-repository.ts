import { PessoaFisica } from "../models/PessoaFisica";
import { AppDataSource } from "../config/data-source";
import { Repository } from "typeorm";

export class PessoaFisicaRepository {
    private repository: Repository<PessoaFisica>;

    constructor() {
        this.repository = AppDataSource.getRepository(PessoaFisica);
    }

    // Buscar por ID
    async findById(id: number): Promise<PessoaFisica | null> {
        return this.repository.findOne({ where: { id } });
    }

    // Buscar por email
    async findByEmail(email: string): Promise<PessoaFisica | null> {
        return this.repository.findOne({ where: { email } });
    }

    // Buscar todos
    async findAll(): Promise<PessoaFisica[]> {
        return this.repository.find();
    }

    // Criar novo registro
    async create(user: PessoaFisica): Promise<PessoaFisica> {
        return this.repository.save(user);
    }

    // Atualização parcial
    async updatePartial(id: number, partialUser: Partial<PessoaFisica>): Promise<PessoaFisica> {
        const user = await this.repository.preload({ id, ...partialUser });

        if (!user) {
            throw new Error("Usuário não encontrado");
        }

        return this.repository.save(user);
    }

    // Deletar por ID
    async delete(id: number): Promise<void> {
        await this.repository.delete(id);
    }
}
