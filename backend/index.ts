import express, { type Request, type Response, type Application } from 'express';
import { sql } from 'drizzle-orm';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './docs/swagger-output.json' with { type: 'json' };
import { getDb } from './db/index.js';
import { stallRouter } from './routes/stallRouter.ts';
import { domainRouter } from './routes/domainRouter.ts';
import { authRouter } from './routes/authRouter.ts';
import { notFoundHandler } from './middlewares/notFound.ts';
import { errorHandler } from './middlewares/errorHandler.ts';

const app: Application = express();
const PORT: number = Number(process.env.PORT ?? 3001);

// CORS: izinkan frontend (Vite) memanggil API dari origin berbeda.
const CORS_ORIGIN = process.env.CORS_ORIGIN ?? 'http://localhost:5173';
app.use((req: Request, res: Response, next) => {
    res.header('Access-Control-Allow-Origin', CORS_ORIGIN);
    res.header('Vary', 'Origin');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    if (req.method === 'OPTIONS') {
        res.sendStatus(204);
        return;
    }
    next();
});

app.use(express.json());

// Dokumentasi API (Swagger UI) dari spec hasil generate swagger-autogen.
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/health', async (req: Request, res: Response) => {
    try {
        const db = await getDb();
        await db.execute(sql`SELECT 1 AS ok`);
        res.status(200).json({ status: 'success', message: 'Server dan database terhubung' });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Gagal terhubung ke database',
            error: error instanceof Error ? error.message : String(error),
        });
    }
});

app.use('/api/v1/stalls', stallRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1', domainRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
