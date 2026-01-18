interface IRepositoryWriter<T> {
  insert(entity: T): Promise<T>;
}

interface IRepositoryReader<T, ID = string> {
  getById(id: ID): Promise<T | null>;
  getAll(): Promise<T[]>;
}
