import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chatRoute from './routes/chatRoute';

dotenv.config();

// Prevent silent crashes on unhandled asynchronous rejections or exceptions
process.on('unhandledRejection', (reason, promise) => {
  console.error('⚠️ Unhandled Promise Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('🚨 Uncaught Exception occurred:', error);
});

const app = express();

// Trust reverse proxy headers (e.g. Render, Cloudflare)
app.set('trust proxy', 1);

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.use('/api', chatRoute);

// Root health check endpoint
app.get('/', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'IntelliQuest AI Chatbot' });
});

// Global express error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Express Request Error:', err);
  res.status(500).json({ error: 'Internal server error occurred.' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});
