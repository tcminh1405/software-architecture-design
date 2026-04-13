export interface GetAllTodosQuery {
  status?: 'pending' | 'in-progress' | 'completed';
}

export interface GetTodoByIdQuery {
  id: string;
}
