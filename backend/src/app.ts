import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const tasks: { id: string; title: string; completed: boolean }[] = [];

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

app.delete('/tasks/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const index = tasks.findIndex((task) => task.id === id);

    if (index !== -1) {
        tasks.splice(index, 1); // Remove task from the array
        res.status(204).send(); // No content
    } else {
        res.status(404).json({ error: 'Task not found' });
    }
});

app.patch('/tasks/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const task = tasks.find((task) => task.id === id);

    if (task) {
        task.completed = !task.completed; // Toggle completed status
        res.json(task);
    } else {
        res.status(404).json({ error: 'Task not found' });
    }
});

export default app;