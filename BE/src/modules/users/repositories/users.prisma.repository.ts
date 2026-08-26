import type { PrismaService } from '../../../prisma/prisma.service';
import type { UserRecord } from '../entities/user.entity';
import type { UsersRepository } from './users.repository';

export class PrismaUsersRepository implements UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<UserRecord | null> {
    const row = await this.prisma.user.findUnique({ where: { id } });
    return row
      ? {
          id: row.id,
          nickname: row.nickname,
          avatarUrl: row.avatarUrl,
          role: row.role,
          createdAt: row.createdAt.toISOString(),
        }
      : null;
  }

  async create(record: UserRecord): Promise<UserRecord> {
    const row = await this.prisma.user.create({
      data: {
        id: record.id,
        nickname: record.nickname,
        avatarUrl: record.avatarUrl,
        role: record.role,
      },
    });
    return {
      id: row.id,
      nickname: row.nickname,
      avatarUrl: row.avatarUrl,
      role: row.role,
      createdAt: row.createdAt.toISOString(),
    };
  }
}
