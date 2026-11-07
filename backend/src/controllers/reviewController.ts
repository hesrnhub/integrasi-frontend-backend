import type { Request, Response } from 'express';
import { getUser } from '../middlewares/auth.ts';
import { getValidated } from '../middlewares/validate.ts';
import type { IdParam } from '../schemas/stallSchema.ts';
import type { CreateReviewInput } from '../schemas/reviewSchema.ts';
import { ReviewService } from '../services/reviewService.ts';

export class ReviewController {
    constructor(private readonly reviewService: ReviewService = new ReviewService()) {}

    createReview = async (req: Request, res: Response): Promise<void> => {
        const { id: stallId } = getValidated<IdParam>(res, 'params');
        const body = getValidated<CreateReviewInput>(res, 'body');
        const { id: userId } = getUser(req);
        const data = await this.reviewService.createReview(stallId, userId, body);
        res.status(201).json({ status: 'success', data });
    };
}
