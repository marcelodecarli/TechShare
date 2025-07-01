import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as jwt.Secret;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables");
}

declare global {
    namespace Express {
        interface Request {
            user?: string | jwt.JwtPayload;
        }
    }
}

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
    // 1. Log para verificar os cookies recebidos
    console.log('[AUTH] Cookies recebidos:', req.cookies);
    
    const token = req.cookies.token; // lê do cookie

    // 2. Log para verificar o token extraído
    console.log('[AUTH] Token extraído:', token || 'Nenhum token encontrado');

    if (!token) {
        console.log('[AUTH] Erro: Nenhum token fornecido');
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    jwt.verify(token, JWT_SECRET, (err: jwt.VerifyErrors | null, decoded: jwt.JwtPayload | string | undefined) => {
        // 3. Log para erros de verificação
        if (err) {
            console.error('[AUTH] Erro na verificação do token:', err.message);
            
            // 4. Log antes de limpar o cookie inválido
            console.log('[AUTH] Limpando cookie inválido...');
            
            res.clearCookie("token", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "none"
            });
            
            res.status(403).json({ message: "Invalid or expired token" });
            return;
        }

        // 5. Log para token válido
        console.log('[AUTH] Token válido. Usuário decodificado:', decoded);
        
        // Adiciona o usuário decodificado à requisição
        req.user = decoded;

        // 6. Log antes de chamar o próximo middleware
        console.log('[AUTH] Chamando próximo middleware...');
        
        next();
    });
}