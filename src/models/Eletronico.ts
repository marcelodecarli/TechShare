import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class PedidoDoacao {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 50 })
    tipoEletronico: string;

    @Column({ type: "varchar", length: 20 })
    nivelNecessidade: string;

    @Column({ type: "varchar", length: 2 })
    estado: string;

    @Column({ type: "varchar", length: 100 })
    cidade: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    comprovanteEscolar?: string; // Caminho para o arquivo ou nome

    constructor(
        tipoEletronico: string,
        nivelNecessidade: string,
        estado: string,
        cidade: string,
        comprovanteEscolar?: string
    ) {
        this.tipoEletronico = tipoEletronico;
        this.nivelNecessidade = nivelNecessidade;
        this.estado = estado;
        this.cidade = cidade;
        this.comprovanteEscolar = comprovanteEscolar;
    }
}
