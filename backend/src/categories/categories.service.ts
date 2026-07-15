import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TransactionType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

const DEFAULT_INCOME_CATEGORIES = [
  { name: 'Salary', icon: '💼', color: '#10b981' },
  { name: 'Bonus', icon: '🎉', color: '#3b82f6' },
  { name: 'Freelance', icon: '💻', color: '#8b5cf6' },
  { name: 'Investment', icon: '📈', color: '#f59e0b' },
  { name: 'Other', icon: '💰', color: '#6b7280' },
];

const DEFAULT_EXPENSE_CATEGORIES = [
  { name: 'Food', icon: '🍔', color: '#ef4444' },
  { name: 'Transportation', icon: '🚗', color: '#f97316' },
  { name: 'Shopping', icon: '🛍️', color: '#ec4899' },
  { name: 'Utilities', icon: '💡', color: '#eab308' },
  { name: 'Entertainment', icon: '🎬', color: '#6366f1' },
  { name: 'Healthcare', icon: '🏥', color: '#14b8a6' },
  { name: 'Education', icon: '📚', color: '#0ea5e9' },
  { name: 'Other', icon: '📦', color: '#6b7280' },
];

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async seedDefaultCategories(userId: string) {
    const existing = await this.prisma.category.count({ where: { userId } });
    if (existing > 0) return;

    const data = [
      ...DEFAULT_INCOME_CATEGORIES.map((c) => ({
        ...c,
        userId,
        type: TransactionType.INCOME,
        isDefault: true,
      })),
      ...DEFAULT_EXPENSE_CATEGORIES.map((c) => ({
        ...c,
        userId,
        type: TransactionType.EXPENSE,
        isDefault: true,
      })),
    ];

    await this.prisma.category.createMany({ data, skipDuplicates: true });
  }

  async findAll(userId: string, type?: TransactionType) {
    return this.prisma.category.findMany({
      where: { userId, ...(type ? { type } : {}) },
      orderBy: [{ isDefault: 'desc' }, { name: 'asc' }],
    });
  }

  async findOne(id: string, userId: string) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');
    if (category.userId !== userId) throw new ForbiddenException();
    return category;
  }

  async create(userId: string, dto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: { userId, ...dto },
    });
  }

  async update(id: string, userId: string, dto: UpdateCategoryDto) {
    const category = await this.findOne(id, userId);
    if (category.isDefault && dto.name) {
      throw new BadRequestException('Cannot rename default categories');
    }
    return this.prisma.category.update({ where: { id }, data: dto });
  }

  async delete(id: string, userId: string) {
    const category = await this.findOne(id, userId);
    if (category.isDefault) {
      throw new BadRequestException('Cannot delete default categories');
    }
    return this.prisma.category.delete({ where: { id } });
  }
}
