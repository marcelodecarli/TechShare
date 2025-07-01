import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import path from 'path';

import { AppDataSource } from './config/data-source';
import UserRoutes from './routes/user-routes';
import TaskRoutes from './routes/task-routes';

dotenv.config();

const app: Application = express();

const PORT = process.env.PORT || 3000;

// public folder
app.use(express.static('public'));

// Middleware
app.use(cors({
    origin: 'localhost:3000',
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Middleware to log which route is being accessed
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`Request Method: ${req.method}, Request URL: ${req.url}`);
    next();
});

// Routes
app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
});

app.use('/api', UserRoutes);
app.use('/api', TaskRoutes);

// Start the server
AppDataSource.initialize()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error during Data Source initialization:', error);
    });