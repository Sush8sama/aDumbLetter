import express, { Express} from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import letterRoutes from './routes/letters';
/**
 * An Express server to Handle the backend.
 */
dotenv.config();            // Load env vars from .env file
const app: Express = express();
const port = Number(process.env.PORT || 3001);

app.use(cors({
    origin: process.env.FRONTEND_URL || true,
    credentials: true
}));
app.use(express.json());    // Middleware to parse JSON request bodies
app.use(cookieParser());


app.use('/auth', authRoutes);
app.use('/letters', letterRoutes);

/**
 * Start the server.
 */
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});