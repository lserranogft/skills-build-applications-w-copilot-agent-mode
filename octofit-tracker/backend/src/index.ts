import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectToDatabase } from './config/database';
import apiRouter from './routes/api';

dotenv.config();

const app: Express = express();
const PORT = Number(process.env.PORT || 8000);

const codespaceName = process.env.CODESPACE_NAME;
const apiBaseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000';
const frontendUrl = codespaceName
  ? `https://${codespaceName}-5173.app.github.dev`
  : 'http://localhost:5173';

app.use(cors({
  origin: [frontendUrl, 'http://localhost:5173', apiBaseUrl, 'http://localhost:8000'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OctoFit Tracker API is running' });
});

app.use('/api', apiRouter);

const startServer = async () => {
  try {
    await connectToDatabase();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`API Base URL: ${apiBaseUrl}`);
      console.log(`Frontend URL: ${frontendUrl}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
