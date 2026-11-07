import { AppError } from '../errors/AppError.ts';
import { NotFoundError } from '../errors/NotFoundError.ts';
import { ReviewRepository } from '../repositories/reviewRepository.ts';
import { StallRepository } from '../repositories/stallRepository.ts';
import type { CreateReviewInput } from '../schemas/reviewSchema.ts';

export class ReviewService {
    constructor(
        private readonly reviewRepository: ReviewRepository = new ReviewRepository(),
        private readonly stallRepository: StallRepository = new StallRepository(),
    ) {}

    async createReview(stallId: number, userId: number, input: CreateReviewInput) {
        const stall = await this.stallRepository.findById(stallId);
        if (!stall) throw new NotFoundError('Warung tidak ditemukan');

        const existing = await this.reviewRepository.findByStallAndUser(stallId, userId);
        if (existing) throw new AppError(409, 'Kamu sudah pernah memberi review untuk warung ini');

        const row = await this.reviewRepository.create({
            stallId,
            userId,
            rating: input.rating,
            comment: input.comment ?? null,
        });
        if (!row) throw new AppError(500, 'Review gagal disimpan');
        await this.reviewRepository.refreshStallSummary(stallId);

        return {
            id: row.id,
            stallId: row.stallId,
            userId: row.userId,
            rating: row.rating,
            comment: row.comment,
            likeCount: row.likeCount,
            createdAt: row.createdAt ? row.createdAt.toISOString() : null,
        };
    }
}
