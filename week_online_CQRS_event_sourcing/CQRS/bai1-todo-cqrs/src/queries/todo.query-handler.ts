import { todoReadStore, TodoReadModel } from '../infrastructure/todo.read-store';
import { GetAllTodosQuery, GetTodoByIdQuery } from './todo.queries';

export class TodoQueryHandler {
  handleGetAll(query: GetAllTodosQuery): TodoReadModel[] {
    const all = todoReadStore.findAll();
    if (query.status) return all.filter((t) => t.status === query.status);
    return all;
  }

  handleGetById(query: GetTodoByIdQuery): TodoReadModel | null {
    return todoReadStore.findById(query.id) ?? null;
  }
}

export const todoQueryHandler = new TodoQueryHandler();
