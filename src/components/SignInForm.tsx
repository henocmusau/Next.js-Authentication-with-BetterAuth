'use client'
import React, { useActionState, useRef, useState } from 'react'
import FormInput from './FormInput'
import { SignInUsername } from '@/actions/auth'
import { BetterClientError, client } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { APIError } from 'better-auth/api'
import SubmitButton from './SubmitButton'

export default function SignInForm() {
    const [pending, setPending] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const handleSubmit = async (data: FormData) => {
        setPending(true)
        const username = data.get('username') as string

        try {
            await client.signIn.username({
                username: username.trim(),
                password: data.get('password') as string,
                // callbackURL: '/dashboard'
            }, {
                onError(ctx) { setError(ctx.error.message) },
                onSuccess: () => router.push('/dashboard')
            })
        } finally {
            setPending(false)
        }
    }

    return (
        <form action={handleSubmit} className="w-full h-full flex flex-col gap-4 items-center justify-center">
            <div className="h-20 w-20 mb-4 text-center rounded-full gradient-1" />
            <h1 className="mb-4 text-3xl font-semibold">Welcome back !</h1>
            {error ? <p className="bg-red-800/40 w-full mb-4 text-center text-slate-300 rounded p-2">{error} </p> : null}
            <FormInput
                label="Username or Phone"
                name="username"
            />
            <FormInput
                label="Password"
                name="password"
                type="password"
            />
            <SubmitButton text='Sign In' />
        </form>
    )
}
