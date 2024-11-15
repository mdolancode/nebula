import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const tasks: { id: string; title: string }[] = [];

// GET /tasks
app.get('/tasks', (req: Request, res: Response) => {
    res.json(tasks);
});


// POST /tasks
app.post('/tasks', (req: Request, res: Response) => {
    const newTask = { id: Date.now().toString(), ...req.body };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

export default app;