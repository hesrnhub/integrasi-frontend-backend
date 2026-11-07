import { eq } from 'drizzle-orm';
import { getDb } from '../db/index.js';
import { auditLogs, flags, likes, menuItems, reviews, stalls, users } from '../db/schema.js';

export interface NewUser {
    name: string;
    email: string;
    passwordHash: string;
    role: 'admin' | 'owner' | 'customer';
}

export interface NewMenuItem {
    stallId: number;
    name: string;
    price: number;
    isAvailable: boolean;
}

export interface NewReview {
    stallId: number;
    userId: number;
    rating: number;
    comment: string | null;
}

export interface NewLike {
    reviewId: number;
    userId: number;
}

export interface NewAuditLog {
    userId: number;
    action: string;
    targetTable: string;
    targetId: number;
    metadata: string | null;
}

export class DomainRepository {
    async findUsers() {
        const db = await getDb();
        return db
            .select({
                id: users.id,
                name: users.name,
                email: users.email,
                role: users.role,
                createdAt: users.createdAt,
            })
            .from(users)
            .orderBy(users.id);
    }

    async createUser(input: NewUser) {
        const db = await getDb();
        const rows = await db.insert(users).output().values(input);
        return rows[0];
    }

    async findMenuItems(id?: number) {
        const db = await getDb();
        const selection = {
            id: menuItems.id,
            stallId: menuItems.stallId,
            name: menuItems.name,
            price: menuItems.price,
            isAvailable: menuItems.isAvailable,
            stall: {
                id: stalls.id,
                name: stalls.name,
                category: stalls.category,
                location: stalls.location,
            },
        };

        if (id !== undefined) {
            return db
                .select(selection)
                .from(menuItems)
                .innerJoin(stalls, eq(menuItems.stallId, stalls.id))
                .where(eq(menuItems.id, id));
        }

        return db
            .select(selection)
            .from(menuItems)
            .innerJoin(stalls, eq(menuItems.stallId, stalls.id))
            .orderBy(menuItems.id);
    }

    async createMenuItem(input: NewMenuItem) {
        const db = await getDb();
        const rows = await db.insert(menuItems).output().values(input);
        return rows[0];
    }

    async updateMenuItem(id: number, input: Partial<Omit<NewMenuItem, 'stallId'>> & { stallId?: number }) {
        const db = await getDb();
        const rows = await db.update(menuItems).set(input).where(eq(menuItems.id, id)).output();
        return rows[0];
    }

    async removeMenuItem(id: number) {
        const db = await getDb();
        const rows = await db.delete(menuItems).where(eq(menuItems.id, id)).output();
        return rows[0];
    }

    async findReviews(id?: number) {
        const db = await getDb();
        const selection = {
            id: reviews.id,
            stallId: reviews.stallId,
            userId: reviews.userId,
            rating: reviews.rating,
            comment: reviews.comment,
            likeCount: reviews.likeCount,
            createdAt: reviews.createdAt,
            updatedAt: reviews.updatedAt,
            user: { id: users.id, name: users.name, role: users.role },
        };

        if (id !== undefined) {
            return db
                .select(selection)
                .from(reviews)
                .innerJoin(users, eq(reviews.userId, users.id))
                .where(eq(reviews.id, id));
        }

        return db
            .select(selection)
            .from(reviews)
            .innerJoin(users, eq(reviews.userId, users.id))
            .orderBy(reviews.id);
    }

    async createReview(input: NewReview) {
        const db = await getDb();
        const rows = await db.insert(reviews).output().values({ ...input, likeCount: 0 });
        return rows[0];
    }

    async removeReview(id: number) {
        const db = await getDb();
        const rows = await db.delete(reviews).where(eq(reviews.id, id)).output();
        return rows[0];
    }

    async createLike(input: NewLike) {
        const db = await getDb();
        const rows = await db.insert(likes).output().values(input);
        return rows[0];
    }

    async removeLike(id: number) {
        const db = await getDb();
        const rows = await db.delete(likes).where(eq(likes.id, id)).output();
        return rows[0];
    }

    async findFlags() {
        const db = await getDb();
        return db.select().from(flags).orderBy(flags.id);
    }

    async updateFlag(id: number, status: string) {
        const db = await getDb();
        const rows = await db
            .update(flags)
            .set({ status })
            .where(eq(flags.id, id))
            .output();
        return rows[0];
    }

    async findAuditLogs() {
        const db = await getDb();
        return db.select().from(auditLogs).orderBy(auditLogs.id);
    }

    async createAuditLog(input: NewAuditLog) {
        const db = await getDb();
        const rows = await db.insert(auditLogs).output().values(input);
        return rows[0];
    }
}