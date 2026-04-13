import { Router, Request, Response } from 'express';
import { todoCommandHandler } from '../commands/todo.command-handler';
import { todoQueryHandler } from '../queries/todo.query-handler';

export const todoRouter = Router();

todoRouter.get('/', (req: Request, res: Response) => {
  const todos = todoQueryHandler.handleGetAll({ status: req.query.status as any });
  res.json({ success: true, data: todos });
});

todoRouter.get('/:id', (req: Request, res: Response) => {
  const todo = todoQueryHandler.handleGetById({ id: req.params.id });
  if (!todo) return res.status(404).json({ success: false, message: 'Not found' });
  res.json({ success: true, data: todo });
});

todoRouter.post('/', (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    const todo = todoCommandHandler.handleCreate({ title, description });
    res.status(201).json({ success: true, data: todo });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
});

todoRouter.put('/:id', (req: Request, res: Response) => {
  try {
    const todo = todoCommandHandler.handleUpdate({ id: req.params.id, ...req.body });
    res.json({ success: true, data: todo });
  } catch (err: any) {
    res.status(404).json({ success: false, message: err.message });
  }
});

todoRouter.delete('/:id', (req: Request, res: Response) => {
  todoCommandHandler.handleDelete({ id: req.params.id });
  res.json({ success: true, message: 'Deleted' });
});
