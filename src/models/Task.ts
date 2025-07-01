import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class Task {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 255 })
    title: string;

    @Column({ type: "text" })
    description: string;

    @Column({ type: "enum", enum: ["pending", "in-progress", "completed"], default: "pending" })
    status?: string;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt!: Date;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updatedAt!: Date;

    @ManyToOne(() => User, (user) => user.tasks, { onDelete: "CASCADE" })
    user!: User;

    constructor(title: string, description: string, status?: string) {
        this.status = status || "pending";
        this.title = title;
        this.description = description;
    }
}