import express from 'express';

const app = express();
app.use(express.json());

const tasks: { id: string; title: string }[] = [];

app.get('/tasks', (req, res) => {
    res.json(tasks);
});

app.post('/tasks', (req, res) => {
    const newTask = { id: Date.now().toString(), ...req.body };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});