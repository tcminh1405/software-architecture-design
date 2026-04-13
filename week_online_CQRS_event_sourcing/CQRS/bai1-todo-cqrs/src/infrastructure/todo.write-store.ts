import { Todo } from '../domain/todo.entity';

class TodoWriteStore {
  private todos: Map<string, Todo> = new Map();

  save(todo: Todo): void {
    this.todos.set(todo.id, { ...todo });
  }

  findById(id: string): Todo | undefined {
    const todo = this.todos.get(id);
    return todo ? { ...todo } : undefined;
  }

  delete(id: string): boolean {
    return this.todos.delete(id);
  }

  findAll(): Todo[] {
    return Array.from(this.todos.values()).map((t) => ({ ...t }));
  }
}

export const todoWriteStore = new TodoWriteStore();
