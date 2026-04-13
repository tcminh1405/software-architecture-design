import { Router, Request, Response } from 'express';
import { orderCommandHandler } from '../commands/order.command-handler';
import { orderQueryHandler } from '../queries/order.query-handler';
import { eventBus } from '../infrastructure/event-bus';

export const orderRouter = Router();

orderRouter.get('/', (req: Request, res: Response) => {
  res.json({ success: true, data: orderQueryHandler.handleGetAll() });
});

orderRouter.get('/:id', (req: Request, res: Response) => {
  const order = orderQueryHandler.handleGetById(req.params.id);
  if (!order) return res.status(404).json({ success: false, message: 'Not found' });
  res.json({ success: true, data: order });
});

orderRouter.post('/', (req: Request, res: Response) => {
  try {
    const order = orderCommandHandler.handleCreate(req.body);
    res.status(201).json({ success: true, data: order });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
});

orderRouter.delete('/:id', (req: Request, res: Response) => {
  try {
    const order = orderCommandHandler.handleCancel({ orderId: req.params.id, reason: req.body.reason });
    res.json({ success: true, data: order });
  } catch (err: any) {
    res.status(404).json({ success: false, message: err.message });
  }
});

orderRouter.get('/events', (req: Request, res: Response) => {
  res.json({ success: true, data: eventBus.getEvents() });
});
