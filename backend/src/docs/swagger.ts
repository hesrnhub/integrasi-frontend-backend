import 'dotenv/config';
import swaggerAutogen from 'swagger-autogen';

const doc = {
    info: { title: 'Review Kantin API', version: '1.0.0' },
    host: `localhost:${process.env.PORT ?? 3001}`,
    servers: [{ url: `http://localhost:${process.env.PORT ?? 3001}` }],
    securityDefinitions: {
        BearerAuth: {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header',
            description: 'Masukkan token dengan format: Bearer <token>',
        },
    },
    definitions: {
        RegisterInput: {
            $name: 'Nama Pengguna',
            $email: 'pengguna@example.com',
            $password: 'rahasia123',
        },
        LoginInput: {
            $email: 'pengguna@example.com',
            $password: 'rahasia123',
        },
        UserInput: {
            $name: 'Mahes',
            $email: 'mahes@example.com',
            $password: 'password-aman',
            $role: 'customer',
        },
        MenuItemInput: {
            $stallId: 1,
            $name: 'Nasi Goreng',
            $price: 15000,
            $isAvailable: true,
        },
        ReviewInput: {
            $stallId: 1,
            $userId: 2,
            $rating: 5,
            comment: 'Enak',
        },
        LikeInput: { $reviewId: 1, $userId: 2 },
        FlagUpdate: { $status: 'reviewed' },
        AuditInput: {
            $userId: 1,
            $action: 'CREATE',
            $targetTable: 'MENU_ITEMS',
            $targetId: 1,
            metadata: { source: 'api' },
        },
        StallInput: {
            $name: 'Warung Baru',
            category: 'Nasi',
            location: 'Kantin FK',
            description: '',
        },
        StallReviewInput: {
            $rating: 5,
            comment: 'Enak',
        },
    },
};

const outputFile = './src/docs/swagger-output.json';
const endpointsFiles = ['./src/index.ts'];

swaggerAutogen()(outputFile, endpointsFiles, doc);
