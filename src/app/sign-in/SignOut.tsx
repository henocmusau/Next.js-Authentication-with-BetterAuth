'use client'
import React from 'react'
import { client } from '@/lib/auth-client'

export default function SignOut() {

    const signOut = async () => {

        const data = await client.signOut()

        console.log(data)
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
