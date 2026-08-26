import type { UserRecord } from '../entities/user.entity';
import type { UsersRepository } from './users.repository';

export class InMemoryUsersRepository implements UsersRepository {
  private readonly users = new Map<string, UserRecord>();

  findById(id: string): Promise<UserRecord | null> {
    return Promise.resolve(this.users.get(id) ?? null);
  }

  create(record: UserRecord): Promise<UserRecord> {
    this.users.set(record.id, record);
    return Promise.resolve(record);
  }
}
