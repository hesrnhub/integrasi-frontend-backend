import { Router } from 'express';
import { StallController } from '../controllers/stallController.ts';
import { ReviewController } from '../controllers/reviewController.ts';
import { authenticate } from '../middlewares/auth.ts';
import { authorize } from '../middlewares/authorize.ts';
import { validate } from '../middlewares/validate.ts';
import { createReviewSchema } from '../schemas/reviewSchema.ts';
import {
    createStallSchema,
    idParamSchema,
    stallQuerySchema,
    updateStallSchema,
} from '../schemas/stallSchema.ts';

const stallRouter = Router();
const stallController = new StallController();
const reviewController = new ReviewController();

stallRouter.get('/', validate(stallQuerySchema, 'query'), stallController.getStalls);

stallRouter.post(
    '/',
    authenticate,
    authorize('owner', 'admin'),
    validate(createStallSchema, 'body'),
    (req, res) => {
        // #swagger.security = [{ "BearerAuth": [] }]
        // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/StallInput' } }
        // #swagger.responses[201] = { description: 'Warung dibuat' }
        return stallController.createStall(req, res);
    },
);

stallRouter.get('/:id', validate(idParamSchema, 'params'), (req, res) => {
    // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
    // #swagger.responses[200] = { description: 'Detail warung' }
    // #swagger.responses[404] = { description: 'Tidak ditemukan' }
    return stallController.getStallById(req, res);
});

stallRouter.put(
    '/:id',
    authenticate,
    authorize('owner', 'admin'),
    validate(idParamSchema, 'params'),
    validate(updateStallSchema, 'body'),
    (req, res) => {
        // #swagger.security = [{ "BearerAuth": [] }]
        // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
        // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/StallInput' } }
        // #swagger.responses[200] = { description: 'Warung ter-update' }
        // #swagger.responses[404] = { description: 'Tidak ditemukan' }
        return stallController.updateStall(req, res);
    },
);

stallRouter.delete(
    '/:id',
    authenticate,
    authorize('admin'),
    validate(idParamSchema, 'params'),
    (req, res) => {
        // #swagger.security = [{ "BearerAuth": [] }]
        // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
        // #swagger.responses[200] = { description: 'Warung terhapus' }
        // #swagger.responses[404] = { description: 'Tidak ditemukan' }
        return stallController.deleteStall(req, res);
    },
);

stallRouter.post(
    '/:id/reviews',
    authenticate,
    validate(idParamSchema, 'params'),
    validate(createReviewSchema, 'body'),
    (req, res, next) => {
        // #swagger.security = [{ "BearerAuth": [] }]
        // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/StallReviewInput' } }
        // #swagger.responses[201] = { description: 'Review berhasil dibuat' }
        return reviewController.createReview(req, res);
    },
);

stallRouter.get('/:id/menus', validate(idParamSchema, 'params'), (req, res) => {
    // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
    // #swagger.responses[200] = { description: 'Daftar menu' }
    // #swagger.responses[404] = { description: 'Tidak ditemukan' }
    return stallController.getStallMenus(req, res);
});

export { stallRouter };
