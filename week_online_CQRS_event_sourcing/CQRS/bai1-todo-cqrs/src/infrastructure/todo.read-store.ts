import { Todo } from '../domain/todo.entity';

export interface TodoReadModel {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

class TodoReadStore {
  private readModels: Map<string, TodoReadModel> = new Map();

  sync(todo: Todo): void {
    this.readModels.set(todo.id, {
      id: todo.id,
      title: todo.title,
      description: todo.description,
      status: todo.status,
      createdAt: todo.createdAt.toISOString(),
      updatedAt: todo.updatedAt.toISOString(),
    });
  }

  remove(id: string): void {
    this.readModels.delete(id);
  }

  findById(id: string): TodoReadModel | undefined {
    const model = this.readModels.get(id);
    return model ? { ...model } : undefined;
  }

  findAll(): TodoReadModel[] {
    return Array.from(this.readModels.values()).map((m) => ({ ...m }));
  }
}

export const todoReadStore = new TodoReadStore();
