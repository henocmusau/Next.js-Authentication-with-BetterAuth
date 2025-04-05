// 'use client'
import React from 'react'
import { client } from '@/lib/auth-client'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { APIError } from 'better-auth/api'
import { redirect } from 'next/navigation'

export default function SignInButton() {

  const signIn = async () => {
    'use server'
    try {
      const data = await auth.api.signInUsername({
        // email: "email@domain.com",
        // name: "Test User",
        body: {
          password: "password1234",
          username: "test",
        },
        callbackURL: '/dashboard',
        // headers: headers()
      })

      redirect('/dashboard')
    } catch (error) {
      if (error instanceof APIError) console.log(error.message, error.status)
    }

  }

  return (
    <button
      className="bg-blue-600 text-white px-8 py-2 rounded cursor-pointer"
      onClick={signIn}
    >
      Sign In
    </button>
  )
}
