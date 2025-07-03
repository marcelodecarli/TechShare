// import { Request, Response } from "express";
// import { TaskRepository } from "../repositories/task-repository";
// import { Task } from "../models/Task";

// export class TaskController {
//     private readonly taskRepo: TaskRepository;

//     constructor() {
//         this.taskRepo = new TaskRepository();
//     }

//     // Get all tasks
//     async getAllTasks(req: Request, res: Response) {
//         try {
//             const tasks = await this.taskRepo.findAll();
//             res.status(200).json(tasks);
//             return;
//         } catch (error) {
//             res.status(500).json({ message: "Error fetching tasks", error });
//             return;
//         }
//     }

//     // Get task by ID
//     async getTaskById(req: Request, res: Response) {
//         const taskId = parseInt(req.params.id);

//         if (isNaN(taskId)) {
//             res.status(400).json({ message: "Invalid task ID" });
//             return;
//         }

//         try {
//             const task = await this.taskRepo.findById(taskId);
//             if (!task) {
//                 res.status(404).json({ message: "Task not found" });
//                 return;
//             }
//             res.status(200).json(task);
//             return;
//         } catch (error) {
//             res.status(500).json({ message: "Error fetching task", error });
//             return;
//         }
//     }

//     // Get tasks by user ID
//     async getTasksByUserId(req: Request, res: Response) {
//         const userId = parseInt(req.params.userId);

//         if (isNaN(userId)) {
//             res.status(400).json({ message: "Invalid user ID" });
//             return;
//         }

//         try {
//             const tasks = await this.taskRepo.findByUserId(userId);
//             res.status(200).json(tasks);
//             return;
//         } catch (error) {
//             res.status(500).json({ message: "Error fetching tasks", error });
//             return;
//         }
//     }

//     // Create new task
//     async createTask(req: Request, res: Response) {
//         const { title, description, status } = req.body;

//         if (!title || !description) {
//             res.status(400).json({ message: "Title and description are required" });
//             return;
//         }

//         try {
//             const task = new Task(title, description, status);
//             const createdTask = await this.taskRepo.create(task);
//             res.status(201).json(createdTask);
//             return;
//         } catch (error) {
//             res.status(500).json({ message: "Error creating task", error });
//             return;
//         }
//     }

//     // Update partial task
//     async updatePartialTask(req: Request, res: Response) {
//         const taskId = parseInt(req.params.id);
//         const partialTask = req.body;

//         if (isNaN(taskId)) {
//             res.status(400).json({ message: "Invalid task ID" });
//             return;
//         }

//         try {

//             const task = await this.taskRepo.findById(taskId);

//             if (!task) {
//                 res.status(404).json({ message: "Task not found" });
//                 return;
//             }

//             // Check if the partial task contains any fields to update
//             if (!partialTask.title && !partialTask.description && !partialTask.status) {
//                 res.status(400).json({ message: "No fields to update" });
//                 return;
//             }

//             const updatedTask = await this.taskRepo.updatePartial(taskId, partialTask);
//             res.status(200).json(updatedTask);
//             return;
//         } catch (error) {
//             res.status(500).json({ message: "Error updating task", error });
//             return;
//         }
//     }

//     // Delete task by ID
//     async deleteTask(req: Request, res: Response) {
//         const taskId = parseInt(req.params.id);

//         if (isNaN(taskId)) {
//             res.status(400).json({ message: "Invalid task ID" });
//             return;
//         }

//         try {
//             const existingTask = await this.taskRepo.findById(taskId);

//             if (!existingTask) {
//                 res.status(404).json({ message: "Task not found" });
//                 return;
//             }

//             await this.taskRepo.delete(taskId);
//             res.status(204).send();
//             return;
//         } catch (error) {
//             res.status(500).json({ message: "Error deleting task", error });
//             return;
//         }
//     }
// }
