import { randomBytes, scrypt as scryptCallback } from 'node:crypto';
import { promisify } from 'node:util';
import {
    DomainRepository,
    type NewAuditLog,
    type NewLike,
    type NewMenuItem,
    type NewReview,
    type NewUser,
} from '../repositories/domainRepository.ts';

const scrypt = promisify(scryptCallback);
type UserRole = NewUser['role'];

function invalidInput(): never {
    throw new Error('INVALID_INPUT');
}

function objectInput(input: unknown): Record<string, unknown> {
    if (typeof input !== 'object' || input === null || Array.isArray(input)) invalidInput();
    return input as Record<string, unknown>;
}

function requiredString(input: Record<string, unknown>, key: string, maxLength: number): string {
    const value = input[key];
    if (typeof value !== 'string' || !value.trim() || value.length > maxLength) invalidInput();
    return value.trim();
}

function positiveInteger(value: unknown): number {
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed <= 0) invalidInput();
    return parsed;
}

async function hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16);
    const hash = (await scrypt(password, salt, 64)) as Buffer;
    return `scrypt$${salt.toString('hex')}$${hash.toString('hex')}`;
}

export class DomainService {
    constructor(private readonly repository: DomainRepository = new DomainRepository()) {}

    async getUsers() {
        return this.repository.findUsers();
    }

    async createUser(input: unknown) {
        const body = objectInput(input);
        const name = requiredString(body, 'name', 100);
        const email = requiredString(body, 'email', 150);
        if (!/^\S+@\S+\.\S+$/.test(email)) invalidInput();
        const password = requiredString(body, 'password', 200);
        if (password.length < 8) invalidInput();
        const role = body.role;
        if (role !== 'admin' && role !== 'owner' && role !== 'customer') invalidInput();

        const user = await this.repository.createUser({
            name,
            email,
            role: role as UserRole,
            passwordHash: await hashPassword(password),
        });
        if (!user) throw new Error('USER_NOT_FOUND');
        const { passwordHash: _passwordHash, ...publicUser } = user;
        return publicUser;
    }

    async getMenuItems(id?: number) {
        const items = await this.repository.findMenuItems(id);
        if (id !== undefined && items.length === 0) throw new Error('MENU_ITEM_NOT_FOUND');
        return id === undefined ? items : items[0];
    }

    async createMenuItem(input: unknown) {
        const body = objectInput(input);
        const menuItem = {
            stallId: positiveInteger(body.stallId),
            name: requiredString(body, 'name', 100),
            price: Number(body.price),
            isAvailable: body.isAvailable,
        };
        if (!Number.isInteger(menuItem.price) || menuItem.price < 0 || typeof menuItem.isAvailable !== 'boolean') {
            invalidInput();
        }
        return this.repository.createMenuItem(menuItem as NewMenuItem);
    }

    async updateMenuItem(id: number, input: unknown) {
        const body = objectInput(input);
        const update: Partial<NewMenuItem> = {};
        if (body.stallId !== undefined) update.stallId = positiveInteger(body.stallId);
        if (body.name !== undefined) update.name = requiredString(body, 'name', 100);
        if (body.price !== undefined) {
            const price = Number(body.price);
            if (!Number.isInteger(price) || price < 0) invalidInput();
            update.price = price;
        }
        if (body.isAvailable !== undefined) {
            if (typeof body.isAvailable !== 'boolean') invalidInput();
            update.isAvailable = body.isAvailable;
        }
        if (Object.keys(update).length === 0) invalidInput();
        const item = await this.repository.updateMenuItem(id, update);
        if (!item) throw new Error('MENU_ITEM_NOT_FOUND');
        return item;
    }

    async deleteMenuItem(id: number) {
        const item = await this.repository.removeMenuItem(id);
        if (!item) throw new Error('MENU_ITEM_NOT_FOUND');
        return item;
    }

    async getReviews(id?: number) {
        const items = await this.repository.findReviews(id);
        if (id !== undefined && items.length === 0) throw new Error('REVIEW_NOT_FOUND');
        return id === undefined ? items : items[0];
    }

    async createReview(input: unknown) {
        const body = objectInput(input);
        const rating = Number(body.rating);
        if (!Number.isInteger(rating) || rating < 1 || rating > 5) invalidInput();
        const comment = body.comment;
        if (comment !== undefined && comment !== null && typeof comment !== 'string') invalidInput();
        return this.repository.createReview({
            stallId: positiveInteger(body.stallId),
            userId: positiveInteger(body.userId),
            rating,
            comment: (comment as string | null | undefined) ?? null,
        } as NewReview);
    }

    async deleteReview(id: number) {
        const review = await this.repository.removeReview(id);
        if (!review) throw new Error('REVIEW_NOT_FOUND');
        return review;
    }

    async createLike(input: unknown) {
        const body = objectInput(input);
        const like = {
            reviewId: positiveInteger(body.reviewId),
            userId: positiveInteger(body.userId),
        };
        return this.repository.createLike(like as NewLike);
    }

    async deleteLike(id: number) {
        const like = await this.repository.removeLike(id);
        if (!like) throw new Error('LIKE_NOT_FOUND');
        return like;
    }

    async getFlags() {
        return this.repository.findFlags();
    }

    async updateFlag(id: number, input: unknown) {
        const body = objectInput(input);
        const status = requiredString(body, 'status', 20);
        const flag = await this.repository.updateFlag(id, status);
        if (!flag) throw new Error('FLAG_NOT_FOUND');
        return flag;
    }

    async getAuditLogs() {
        return this.repository.findAuditLogs();
    }

    async createAuditLog(input: unknown) {
        const body = objectInput(input);
        const metadata = body.metadata;
        if (metadata !== undefined && metadata !== null && typeof metadata !== 'string' && typeof metadata !== 'object') {
            invalidInput();
        }
        const log = {
            userId: positiveInteger(body.userId),
            action: requiredString(body, 'action', 50),
            targetTable: requiredString(body, 'targetTable', 50),
            targetId: positiveInteger(body.targetId),
            metadata: metadata == null ? null : typeof metadata === 'string' ? metadata : JSON.stringify(metadata),
        };
        return this.repository.createAuditLog(log as NewAuditLog);
    }
}