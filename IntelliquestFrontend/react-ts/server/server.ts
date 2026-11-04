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
app.use(cors());
app.use(express.json());

app.use('/api', chatRoute);

// Global express error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Express Request Error:', err);
  res.status(500).json({ error: 'Internal server error occurred.' });
});

app.listen(5000, () => {
  console.log('✅ Backend running on http://localhost:5000');
});
