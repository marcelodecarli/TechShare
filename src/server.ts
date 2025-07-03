import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import path from 'path';

import { AppDataSource } from './config/data-source';
import UserRoutes from './routes/user-routes';
//import TaskRoutes from './routes/task-routes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// ✅ Servir arquivos estáticos (HTML, imagens etc.)
app.use(express.static('public'));

// ✅ Middleware CORS com protocolo http
app.use(cors({
    origin: 'http://localhost:3000', // Corrigido!
    credentials: true // Permite envio de cookies e headers com autenticação
}));

// ✅ Middlewares padrões
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Middleware para log de requisições
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`Request Method: ${req.method}, Request URL: ${req.url}`);
    next();
});

// ✅ Página inicial (login.html)
app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
});

// ✅ Rotas da API
app.use('/api', UserRoutes); // ex: /api/register, /api/login
//app.use('/api', TaskRoutes); // ex: /api/tasks

// ✅ Inicializar conexão com banco e subir servidor
AppDataSource.initialize()
    .then(() => {
        console.log('✅ Banco de dados conectado com sucesso');
        app.listen(PORT, () => {
            console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('❌ Erro ao conectar no banco de dados:', error);
    });
