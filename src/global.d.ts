export type RequireID<T> = Omit<T, 'id'> & { id: string };
