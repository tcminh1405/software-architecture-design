export interface CreateTodoCommand {
  title: string;
  description: string;
}

export interface UpdateTodoCommand {
  id: string;
  title?: string;
  description?: string;
  status?: 'pending' | 'in-progress' | 'completed';
}

export interface DeleteTodoCommand {
  id: string;
}
