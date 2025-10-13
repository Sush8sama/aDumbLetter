import express, { Express, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import SaveLetterBody from './types';

/**
 * An Express server to Handle the backend.
 */
const app: Express = express();
const port: number = 3001;
app.use(cors());            // Enable CORS for all routes
app.use(express.json());    // Middleware to parse JSON request bodies


/**
 * Endpoint to save the letter text to a file.
 */
app.post('/save-letter', (req: Request, res: Response) => {
    // Type assertion for the request body
    const { text } = req.body as SaveLetterBody;
    
    // Due to lack of database uses a simple text file to store the letter
    // e.g., /my-project/server and /my-project/client
    const filePath = path.join('src','db', 'letter.txt'); 

    fs.writeFile(filePath, text, (err: NodeJS.ErrnoException | null) => {
        if (err) {
            console.error('Failed to save letter:', err);
            return res.status(500).send('Failed to save the letter.');
        }
        res.send('Letter saved successfully.');
    });
});



/**
 * Start the server.
 */
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});