'use client'

import { useEffect, useState } from 'react'
import { useAccounts } from '@/hooks/use-accounts'
import { useCategories } from '@/hooks/use-categories'
import { useCreateTransaction, useUpdateTransaction } from '@/hooks/use-transactions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Transaction, TransactionType } from '@/types'

interface Props {
  open: boolean
  onClose: () => void
  type: TransactionType
  transaction?: Transaction
}

export function TransactionDialog({ open, onClose, type, transaction }: Props) {
  const { data: accounts = [] } = useAccounts()
  const { data: categories = [] } = useCategories(type)
  const createMutation = useCreateTransaction()
  const updateMutation = useUpdateTransaction()

  const [amount, setAmount] = useState('')
  const [date, setDate] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [accountId, setAccountId] = useState('')
  const [merchant, setMerchant] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return
    if (transaction) {
      setAmount(String(transaction.amount))
      setDate(transaction.date.slice(0, 10))
      setCategoryId(transaction.categoryId)
      setAccountId(transaction.accountId)
      setMerchant(transaction.merchant ?? '')
      setDescription(transaction.description ?? '')
    } else {
      setAmount('')
      setDate(new Date().toISOString().slice(0, 10))
      setCategoryId('')
      setAccountId('')
      setMerchant('')
      setDescription('')
    }
    setError('')
  }, [open, transaction])

  const isPending = createMutation.isPending || updateMutation.isPending

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!categoryId || !accountId) {
      setError('กรุณาเลือกหมวดหมู่และบัญชี')
      return
    }
    setError('')

    const data = {
      type,
      amount: Number(amount),
      date,
      categoryId,
      accountId,
      merchant: merchant || undefined,
      description: description || undefined,
    }

    try {
      if (transaction) {
        await updateMutation.mutateAsync({ id: transaction.id, ...data })
      } else {
        await createMutation.mutateAsync(data)
      }
      onClose()
    } catch {
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่')
    }
  }

  const title = `${transaction ? 'แก้ไข' : 'เพิ่ม'}${type === 'INCOME' ? 'รายรับ' : 'รายจ่าย'}`

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
              {error}
            </p>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>จำนวนเงิน</Label>
              <Input
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>วันที่</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>หมวดหมู่</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="เลือกหมวดหมู่" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.icon} {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>บัญชี</Label>
            <Select value={accountId} onValueChange={setAccountId}>
              <SelectTrigger>
                <SelectValue placeholder="เลือกบัญชี" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>ร้านค้า / แหล่งที่มา</Label>
            <Input
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              placeholder="ไม่บังคับ"
            />
          </div>

          <div className="space-y-2">
            <Label>หมายเหตุ</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="ไม่บังคับ"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              ยกเลิก
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'กำลังบันทึก...' : 'บันทึก'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
