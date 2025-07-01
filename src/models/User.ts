import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Task } from "./Task";


@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 255 })
    email: string;

    @Column({ type: "varchar", length: 255 })
    password: string;

    @OneToMany(() => Task, (task) => task.user, { onDelete: "CASCADE" })
    tasks!: Task[];

    constructor(email: string, password: string) {
        this.email = email;
        this.password = password;
    }

}