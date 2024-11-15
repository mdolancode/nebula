import request from 'supertest';
import express, { Request, Response } from 'express';

const app = express();app.use(express.json());
app.use(express.json());

const tasks: { id: string; title: string }[] = [];
app.get('/tasks', (req: Request, res: Response) => { 
    res.json(tasks)
});
app.post('/tasks', (req: Request, res: Response) => {
    const newTask = { id: Date.now().toString(), ...req.body };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

describe('Task API', () => {
test('GET /taks should return an array initially', async () => {
    const response = await request(app).get('/tasks');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
}),

test('POST /tasks should add a new task', async () => {
    const newTask = { title: 'Test Task' };
    const response = await request(app).post('/tasks').send(newTask);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe('Test Task');
});

});