'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== repeatPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
            `${window.location.origin}/`,
          data: {
            username: username || `player_${Date.now()}`,
            display_name: username || email.split('@')[0],
          },
        },
      })
      if (error) throw error
      router.push('/auth/sign-up-success')
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          <div className="text-center mb-4">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-2">
              GEAR PERKS
            </h1>
            <p className="text-slate-400">Join the ultimate card battle arena!</p>
          </div>
          
          <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-white">Sign up</h2>
              <p className="text-slate-400 text-sm mt-1">
                Create your duelist account
              </p>
            </div>
            <form onSubmit={handleSignUp}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <label htmlFor="username" className="text-white text-sm font-medium">Username</label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your duelist name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="email" className="text-white text-sm font-medium">Email</label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="duelist@gearperks.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="password" className="text-white text-sm font-medium">Password</label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="repeat-password" className="text-white text-sm font-medium">Confirm Password</label>
                  <Input
                    id="repeat-password"
                    type="password"
                    required
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                {error && (
                  <div className="p-3 text-sm text-red-400 bg-red-950/50 border border-red-900 rounded-lg">
                    {error}
                  </div>
                )}
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating account...' : 'Sign up'}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm text-slate-400">
                {"Already have an account? "}
                <Link
                  href="/auth/login"
                  className="text-blue-400 hover:text-blue-300 underline underline-offset-4"
                >
                  Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
