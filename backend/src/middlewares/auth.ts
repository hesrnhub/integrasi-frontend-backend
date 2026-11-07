import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { UnauthorizedError } from '../errors/UnauthorizedError.ts';
import { verifyToken, type AuthUser } from '../services/tokenService.ts';

function extractToken(req: Request): string | null {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) return null;
    const token = header.slice('Bearer '.length).trim();
    return token.length > 0 ? token : null;
}

export const authenticate: RequestHandler = (
    req: Request,
    _res: Response,
    next: NextFunction,
) => {
    const token = extractToken(req);
    if (!token) return next(new UnauthorizedError('Header Authorization dengan token Bearer wajib dikirim'));

    try {
        req.user = verifyToken(token);
        return next();
    } catch {
        return next(new UnauthorizedError());
    }
};

export function getUser(req: Request): AuthUser {
    if (!req.user) throw new UnauthorizedError('Endpoint ini harus memakai middleware authenticate');
    return req.user;
}
