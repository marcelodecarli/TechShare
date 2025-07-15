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
            user?: {
                id: number;
                email: string;
                [key: string]: any;
            };
        }
    }
}

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.token;

    if (!token) {
        console.log('[AUTH] Tentativa de acesso sem token', {
            ip: req.ip,
            path: req.path,
            method: req.method
        });
         res.status(401).json({ 
            success: false,
            error: "Token de autenticação necessário" 
        });
        return
    }

    jwt.verify(token, JWT_SECRET, (err: jwt.VerifyErrors | null, decoded: any) => {
        if (err) {
            console.error('[AUTH] Token inválido:', {
                error: err.name,
                message: err.message,
                ip: req.ip
            });
            
            clearAuthCookie(res);
            
             res.status(403).json({ 
                success: false,
                error: "Token inválido ou expirado" 
            });
            return
        }

        // Adiciona informações do usuário à requisição
        req.user = {
            id: decoded.id,
            email: decoded.email
        };

        console.log('[AUTH] Acesso autorizado:', {
            userId: decoded.id,
            ip: req.ip,
            path: req.path
        });

        next();
    });
}

export function clearAuthCookie(res: Response) {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
    });
}

export function setAuthCookie(res: Response, token: string) {
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 3600000 // 1 hora
    });
}