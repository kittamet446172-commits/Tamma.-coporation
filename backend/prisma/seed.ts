import { PrismaClient, TransactionType } from '@prisma/client';

const prisma = new PrismaClient();

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

export async function seedDefaultCategories(userId: string) {
  const incomeCategories = DEFAULT_INCOME_CATEGORIES.map((c) => ({
    ...c,
    userId,
    type: TransactionType.INCOME,
    isDefault: true,
  }));

  const expenseCategories = DEFAULT_EXPENSE_CATEGORIES.map((c) => ({
    ...c,
    userId,
    type: TransactionType.EXPENSE,
    isDefault: true,
  }));

  await prisma.category.createMany({
    data: [...incomeCategories, ...expenseCategories],
    skipDuplicates: true,
  });
}

async function main() {
  console.log('Seed completed (categories are created per-user on registration)');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
