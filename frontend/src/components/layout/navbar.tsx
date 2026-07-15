'use client'

import { useRouter } from 'next/navigation'
import { LogOut, Menu, User } from 'lucide-react'
import { signOut, useSession } from '@/lib/auth-client'
import { useUiStore } from '@/store/ui.store'
import { Button } from '@/components/ui/button'

export function Navbar() {
  const { data: session } = useSession()
  const router = useRouter()
  const { toggleSidebar } = useUiStore()

  async function handleSignOut() {
    await signOut()
    router.push('/login')
  }

  return (
    <header className="flex h-14 items-center justify-between border-b bg-card px-4">
      <Button variant="ghost" size="icon" onClick={toggleSidebar}>
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex items-center gap-2">
        <User className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          {session?.user.name}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSignOut}
          title="ออกจากระบบ"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}
