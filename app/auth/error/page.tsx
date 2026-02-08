'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function ErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error') || 'An unknown error occurred'
  const errorDescription = searchParams.get('error_description') || 'Please try again or contact support if the problem persists.'

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
              <div className="p-3 bg-red-950/50 border border-red-900 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" x2="12" y1="8" y2="12" />
                  <line x1="12" x2="12.01" y1="16" y2="16" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white text-center mb-2">Authentication Error</h2>
            <p className="text-slate-400 text-center text-sm mb-4">
              We encountered an issue while processing your request
            </p>
            <div className="space-y-4">
              <div className="p-4 bg-red-950/30 border border-red-900 rounded-lg">
                <p className="text-sm font-medium text-red-400 mb-1">{error}</p>
                <p className="text-sm text-red-300">{errorDescription}</p>
              </div>
              
              <div className="flex gap-2">
                <Link href="/auth/login" className="flex-1">
                  <Button className="w-full" variant="outline">
                    Back to Login
                  </Button>
                </Link>
                <Link href="/" className="flex-1">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Go Home
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  )
}
