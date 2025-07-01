import { Task } from "../models/Task";
import { AppDataSource } from "../config/data-source";
import { Repository } from "typeorm";

export class TaskRepository {
    private taskRepository: Repository<Task>;

    constructor() {
        this.taskRepository = AppDataSource.getRepository(Task);
    }

    // Find task by ID
    async findById(id: number): Promise<Task | null> {
        return this.taskRepository.findOne({
            where: { id },
            relations: ["user"], // caso queira o usuário vinculado
        });
    }

    // Find all tasks
    async findAll(): Promise<Task[]> {
        return this.taskRepository.find({
            relations: ["user"],
        });
    }

    // Find tasks by user ID
    async findByUserId(userId: number): Promise<Task[]> {
        return this.taskRepository.find({
            where: { user: { id: userId } },
            relations: ["user"],
        });
    }

    // Create new task
    async create(task: Task): Promise<Task> {
        return this.taskRepository.save(task);
    }

    // Update partial task (using preload)
    async updatePartial(id: number, partialTask: Partial<Task>): Promise<Task> {
        const task = await this.taskRepository.preload({ id, ...partialTask });

        if (!task) {
            throw new Error("Task not found");
        }

        return this.taskRepository.save(task);
    }

    // Delete task by ID
    async delete(id: number): Promise<void> {
        await this.taskRepository.delete(id);
    }
}