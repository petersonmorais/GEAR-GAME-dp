'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'
import { Mail } from 'lucide-react'

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
          
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-green-950/50 border border-green-900 rounded-full">
                  <Mail className="h-8 w-8 text-green-400" />
                </div>
              </div>
              <CardTitle className="text-2xl text-white text-center">Check your email</CardTitle>
              <CardDescription className="text-slate-400 text-center">
                We&apos;ve sent you a confirmation email. Please click the link in the email to verify your account and start your dueling journey!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-950/30 border border-blue-900 rounded-lg">
                <p className="text-sm text-blue-300">
                  <strong>Important:</strong> Make sure to check your spam folder if you don&apos;t see the email in your inbox.
                </p>
              </div>
              
              <Link href="/auth/login" className="block">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Go to Login
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
