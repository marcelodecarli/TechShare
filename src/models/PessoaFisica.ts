import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class PessoaFisica {
    
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 255 })
    email: string;

    @Column({ type: "varchar", length: 255 })
    nome: string;

    @Column({ type: "varchar", length: 14 }) // CPF formatado: 000.000.000-00
    cpf: string;

    @Column({ type: "varchar", length: 20 })
    telefone: string;

    @Column({ type: "date" })
    dataNascimento: Date;

    @Column({ type: "varchar", length: 255 })
    senha: string;

    constructor(
        email: string,
        nome: string,
        cpf: string,
        telefone: string,
        dataNascimento: Date,
        senha: string
    ) {
        this.email = email;
        this.nome = nome;
        this.cpf = cpf;
        this.telefone = telefone;
        this.dataNascimento = dataNascimento;
        this.senha = senha;
    }
}
