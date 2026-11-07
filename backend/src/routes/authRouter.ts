import { Router } from 'express';
import { AuthController } from '../controllers/authController.ts';
import { authenticate } from '../middlewares/auth.ts';
import { validate } from '../middlewares/validate.ts';
import { loginSchema, registerSchema } from '../schemas/authSchema.ts';

const authRouter = Router();
const controller = new AuthController();

authRouter.post('/register', (req, res, next) => {
    // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/RegisterInput' } }
    // #swagger.responses[201] = { description: 'Akun customer berhasil dibuat' }
    return validate(registerSchema, 'body')(req, res, next);
}, controller.register);
authRouter.post('/login', (req, res, next) => {
    // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/LoginInput' } }
    // #swagger.responses[200] = { description: 'Login berhasil dan token JWT dikembalikan' }
    return validate(loginSchema, 'body')(req, res, next);
}, controller.login);
authRouter.get('/me', (req, res, next) => {
    // #swagger.security = [{ "BearerAuth": [] }]
    return authenticate(req, res, next);
}, controller.getMe);

export { authRouter };
