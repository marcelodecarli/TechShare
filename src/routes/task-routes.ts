// import { Router } from 'express';
// import { TaskController } from '../controllers/task-controller';
// import { authenticateToken } from '../middlewares/auth-middleware';

// const taskController = new TaskController();
// const router = Router();

// // Define the routes for task operations
// router.post('/tasks', authenticateToken, taskController.createTask.bind(taskController)); // Create task route
// router.get('/tasks', authenticateToken, taskController.getAllTasks.bind(taskController)); // Get all tasks route
// router.get('/tasks/:id', authenticateToken, taskController.getTaskById.bind(taskController)); // Get task by ID route
// router.get('/tasks/user/:userId', authenticateToken, taskController.getTasksByUserId.bind(taskController)); // Get tasks by user ID route
// router.patch('/tasks/:id', authenticateToken, taskController.updatePartialTask.bind(taskController)); // Update task route
// router.delete('/tasks/:id', authenticateToken, taskController.deleteTask.bind(taskController)); // Delete task route

// export default router;
