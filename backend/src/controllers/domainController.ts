import type { Request, Response } from 'express';
import { DomainService } from '../services/domainService.ts';

export class DomainController {
    constructor(private readonly service: DomainService = new DomainService()) {}

    private async execute(
        res: Response,
        action: () => Promise<unknown>,
        successStatus = 200,
    ): Promise<Response> {
        try {
            const data = await action();
            return res.status(successStatus).json({ status: 'success', data });
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            if (message === 'INVALID_INPUT') {
                return res.status(400).json({ status: 'fail', message: 'Input tidak valid' });
            }
            if (message.endsWith('_NOT_FOUND')) {
                return res.status(404).json({ status: 'fail', message: 'Data tidak ditemukan' });
            }
            return res.status(500).json({
                status: 'error',
                message: 'Terjadi kesalahan pada server',
                error: message,
            });
        }
    }

    private getId(req: Request): number {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) throw new Error('INVALID_INPUT');
        return id;
    }

    getUsers = (_req: Request, res: Response) => this.execute(res, () => this.service.getUsers());
    createUser = (req: Request, res: Response) =>
        this.execute(res, () => this.service.createUser(req.body), 201);

    getMenuItems = (_req: Request, res: Response) =>
        this.execute(res, () => this.service.getMenuItems());
    getMenuItem = (req: Request, res: Response) =>
        this.execute(res, () => this.service.getMenuItems(this.getId(req)));
    createMenuItem = (req: Request, res: Response) =>
        this.execute(res, () => this.service.createMenuItem(req.body), 201);
    updateMenuItem = (req: Request, res: Response) =>
        this.execute(res, () => this.service.updateMenuItem(this.getId(req), req.body));
    deleteMenuItem = (req: Request, res: Response) =>
        this.execute(res, () => this.service.deleteMenuItem(this.getId(req)));

    getReviews = (_req: Request, res: Response) =>
        this.execute(res, () => this.service.getReviews());
    getReview = (req: Request, res: Response) =>
        this.execute(res, () => this.service.getReviews(this.getId(req)));
    createReview = (req: Request, res: Response) =>
        this.execute(res, () => this.service.createReview(req.body), 201);
    deleteReview = (req: Request, res: Response) =>
        this.execute(res, () => this.service.deleteReview(this.getId(req)));

    createLike = (req: Request, res: Response) =>
        this.execute(res, () => this.service.createLike(req.body), 201);
    deleteLike = (req: Request, res: Response) =>
        this.execute(res, () => this.service.deleteLike(this.getId(req)));

    getFlags = (_req: Request, res: Response) => this.execute(res, () => this.service.getFlags());
    updateFlag = (req: Request, res: Response) =>
        this.execute(res, () => this.service.updateFlag(this.getId(req), req.body));

    getAuditLogs = (_req: Request, res: Response) =>
        this.execute(res, () => this.service.getAuditLogs());
    createAuditLog = (req: Request, res: Response) =>
        this.execute(res, () => this.service.createAuditLog(req.body), 201);
}