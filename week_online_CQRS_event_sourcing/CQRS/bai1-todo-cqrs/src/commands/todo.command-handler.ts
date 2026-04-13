import { v4 as uuidv4 } from 'uuid';
import { Todo } from '../domain/todo.entity';
import { todoWriteStore } from '../infrastructure/todo.write-store';
import { todoReadStore } from '../infrastructure/todo.read-store';
import {
  CreateTodoCommand,
  UpdateTodoCommand,
  DeleteTodoCommand,
} from './todo.commands';

export class TodoCommandHandler {
  handleCreate(cmd: CreateTodoCommand): Todo {
    const now = new Date();
    const todo: Todo = {
      id: uuidv4(),
      title: cmd.title,
      description: cmd.description || '',
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    };
    todoWriteStore.save(todo);
    todoReadStore.sync(todo);
    return todo;
  }

  handleUpdate(cmd: UpdateTodoCommand): Todo {
    const existing = todoWriteStore.findById(cmd.id);
    if (!existing) throw new Error(`Todo not found: ${cmd.id}`);

    const updated: Todo = {
      ...existing,
      title: cmd.title ?? existing.title,
      description: cmd.description ?? existing.description,
      status: cmd.status ?? existing.status,
      updatedAt: new Date(),
    };
    todoWriteStore.save(updated);
    todoReadStore.sync(updated);
    return updated;
  }

  handleDelete(cmd: DeleteTodoCommand): void {
    todoWriteStore.delete(cmd.id);
    todoReadStore.remove(cmd.id);
  }
}

export const todoCommandHandler = new TodoCommandHandler();
