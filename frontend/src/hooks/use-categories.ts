import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Category, TransactionType } from '@/types'

export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  byType: (type?: TransactionType) =>
    [...categoryKeys.all, 'list', type] as const,
}

export function useCategories(type?: TransactionType) {
  return useQuery({
    queryKey: categoryKeys.byType(type),
    queryFn: () => {
      const params = type ? `?type=${type}` : ''
      return api.get<Category[]>(`/categories${params}`)
    },
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<Category, 'id' | 'isDefault'>) =>
      api.post<Category>('/categories', data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: categoryKeys.all }),
  })
}

export function useUpdateCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Category> & { id: string }) =>
      api.patch<Category>(`/categories/${id}`, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: categoryKeys.all }),
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete<Category>(`/categories/${id}`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: categoryKeys.all }),
  })
}
