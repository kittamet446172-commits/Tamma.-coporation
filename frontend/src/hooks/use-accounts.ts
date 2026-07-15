import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Account } from '@/types'

export const accountKeys = {
  all: ['accounts'] as const,
  lists: () => [...accountKeys.all, 'list'] as const,
  detail: (id: string) => [...accountKeys.all, 'detail', id] as const,
}

export function useAccounts() {
  return useQuery({
    queryKey: accountKeys.lists(),
    queryFn: () => api.get<Account[]>('/accounts'),
  })
}

export function useCreateAccount() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>) =>
      api.post<Account>('/accounts', data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: accountKeys.all }),
  })
}

export function useUpdateAccount() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Account> & { id: string }) =>
      api.patch<Account>(`/accounts/${id}`, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: accountKeys.all }),
  })
}

export function useDeleteAccount() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete<Account>(`/accounts/${id}`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: accountKeys.all }),
  })
}
