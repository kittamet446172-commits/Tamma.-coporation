import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, createdAt: true },
    });
  }

  async updateProfile(id: string, data: { name: string }) {
    return this.prisma.user.update({
      where: { id },
      data: { name: data.name },
      select: { id: true, name: true, email: true, updatedAt: true },
    });
  }
}
