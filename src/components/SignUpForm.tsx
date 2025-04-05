'use client'
import React, { useActionState, useRef, useState } from 'react'
import FormInput from './FormInput'
import { SignUpUsername } from '@/actions/auth'
import { client } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'

export default function SignUpForm() {
    // const [data, action, isPending] = useActionState(SignUpUsername, undefined)
    const [isPending, setIsPending] = useState(false)
    const router = useRouter()

    const formRef = useRef<HTMLFormElement>(null)
    const firstnameRef = useRef<HTMLInputElement>(null)
    const lastnameRef = useRef<HTMLInputElement>(null)
    const emailRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setIsPending(true)
        e.preventDefault()

        const email = emailRef?.current?.value as string
        const name = firstnameRef?.current?.value as string + ' ' + lastnameRef?.current?.value as string
        const password = passwordRef?.current?.value as string
        const username = name.replace(' ', '').trim().toLowerCase()

        try {
            await client.signUp.email({
                name,
                email,
                password,
                username,
                // callbackURL: '/dashboard'
            })
            router.push('/dashboard')
        } catch (error) {
            console.error(error)
        } finally {
            setIsPending(false)
        }


        // await SignUpUsername(data)
        //     .then(() => router.push('/dashboard'))
        //     .catch(e => console.error(e))
        //     .finally(() => setIsPending(false))
    }

    return (
        <form onSubmit={handleSubmit} className="w-full h-full flex flex-col gap-4 items-center justify-center">
            <div className="h-10 w-10 text-center rounded-full gradient-1" />
            <h1 className="mb-8 text-3xl font-semibold">Let's Get Started !</h1>
            {/* {data ?
                <p className='p-4 bg-red-800 text-white rounded'>{data?.error.message} </p> : null
            } */}
            <FormInput
                label="Firstname"
                name="firstname"
                inputRef={firstnameRef}
            />
            <FormInput
                label="Lastname"
                name="lastname"
                inputRef={lastnameRef}
            />
            <FormInput
                label="Password"
                name="password"
                type="password"
                inputRef={passwordRef}
            />
            <FormInput
                label="Email"
                name="email"
                type="email"
                inputRef={emailRef}
            />
            <button
                type="submit"
                className="w-full rounded py-2 gradient-1 cursor-pointer"
                disabled={isPending}
            >
                {isPending ? "..." : "Sign Up"}
            </button>
        </form>
    )
}

// async function customAction(prev: unknown, formData: FormData) {
//     const username = formData.get('firstname') as string + formData.get('lastname') as string
//     const name = formData.get('firstname') as string + formData.get('lastname') as string
//     console.log(formData)
//     try {
//         const data = await client.signUp.email({
//             username: username.trim(),
//             password: formData.get('password') as string,
//             email: formData.get('password') as string,
//             name: name.trim(),
//         })
//         // await SignUpUsername(formData)
//         console.log(data)
//         // return data
//     } catch (error: any) {
//         return { error: error.message }
//     }

// }