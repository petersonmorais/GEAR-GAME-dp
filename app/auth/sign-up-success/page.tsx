'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          <div className="text-center mb-4">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-2">
              GEAR PERKS
            </h1>
          </div>
          
          <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-green-950/50 border border-green-900 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white text-center mb-2">Check your email</h2>
            <p className="text-slate-400 text-center text-sm mb-4">
              {"We've sent you a confirmation email. Please click the link in the email to verify your account and start your dueling journey!"}
            </p>
            <div className="space-y-4">
              <div className="p-4 bg-blue-950/30 border border-blue-900 rounded-lg">
                <p className="text-sm text-blue-300">
                  {"Make sure to check your spam folder if you don't see the email in your inbox."}
                </p>
              </div>
              
              <Link href="/auth/login" className="block">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Go to Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
