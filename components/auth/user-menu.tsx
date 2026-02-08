'use client'

import { useAuth } from '@/components/auth/auth-provider'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User, LogOut, Settings, Trophy, Coins } from 'lucide-react'
import Link from 'next/link'

export function UserMenu() {
  const { user, profile, signOut } = useAuth()

  if (!user || !profile) {
    return (
      <div className="flex gap-2">
        <Link href="/auth/login">
          <Button variant="outline" size="sm">
            Login
          </Button>
        </Link>
        <Link href="/auth/sign-up">
          <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600">
            Sign Up
          </Button>
        </Link>
      </div>
    )
  }

  const initials = profile.username
    ? profile.username.slice(0, 2).toUpperCase()
    : 'GP'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={profile.avatar_url || ''} alt={profile.username} />
            <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-slate-900 border-slate-700" align="end">
        <DropdownMenuLabel className="text-white">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{profile.username}</p>
            <p className="text-xs text-slate-400">{user.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1 text-yellow-400">
                <Coins className="h-3 w-3" />
                <span className="text-xs">{profile.coins}</span>
              </div>
              <div className="flex items-center gap-1 text-blue-400">
                <Trophy className="h-3 w-3" />
                <span className="text-xs">Lvl {profile.level}</span>
              </div>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-slate-700" />
        <DropdownMenuItem className="text-slate-300 focus:text-white focus:bg-slate-800">
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="text-slate-300 focus:text-white focus:bg-slate-800">
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-slate-700" />
        <DropdownMenuItem
          className="text-red-400 focus:text-red-300 focus:bg-slate-800"
          onClick={signOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
