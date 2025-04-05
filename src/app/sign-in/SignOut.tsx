'use client'
import React from 'react'
import { client } from '@/lib/auth-client'
import { APIError } from 'better-auth/api'
import { useRouter } from 'next/navigation'

export default function SignOut() {
    const router = useRouter()

    const signOut = async () => {
        try {
            await client.signOut()

            router.push('/sign-in')
        } catch (error) {
            if (error instanceof APIError) console.log(error.message, error.status)
        }
    }

    return (
        <button
            className="bg-red-600 text-white px-8 py-2 rounded cursor-pointer"
            onClick={signOut}
        >
            Sign Out
        </button>
    )
}
