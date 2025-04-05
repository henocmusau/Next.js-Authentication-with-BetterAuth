'use client'
import React, { useActionState, useRef, useState } from 'react'
import FormInput from './FormInput'
import { SignInUsername } from '@/actions/auth'
import { client } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'

export default function SignInForm() {
    // const [data, action, isPending] = useActionState(SignInUsername, undefined)
    const [pending, setPending] = useState(false)
    const router = useRouter()

    const formRef = useRef<HTMLFormElement>(null)
    const usernameRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setPending(true)
        e.preventDefault()
        const data = new FormData()
        data.append('username', usernameRef?.current?.value as string)
        data.append('password', passwordRef?.current?.value as string)

        try {
            await client.signIn.username({
                username: usernameRef?.current?.value as string,
                password: passwordRef?.current?.value as string,
                // callbackURL: '/dashboard'
            })
            router.push('/dashboard')
        } catch (error) {
            console.error(error)
        } finally {
            setPending(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="w-full h-full flex flex-col gap-4 items-center justify-center">
            <div className="h-20 w-20 mb-4 text-center rounded-full gradient-1" />
            <h1 className="mb-16 text-3xl font-semibold">Welcome back !</h1>
            <FormInput
                label="Username or Phone"
                name="username"
                inputRef={usernameRef}
            />
            <FormInput
                label="Password"
                name="password"
                type="password"
                inputRef={passwordRef}
            />
            <button
                type="submit"
                className="w-full rounded py-2 gradient-1 cursor-pointer"
                disabled={pending}
            >
                {pending ? "..." : "Sign In"}
            </button>
        </form>
    )
}
