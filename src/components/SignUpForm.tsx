'use client'
import React, { useActionState, useRef, useState } from 'react'
import FormInput from './FormInput'
import { SignUpUsername } from '@/actions/auth'
import { client } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'

export default function SignUpForm() {
    const [isPending, setIsPending] = useState(false)
    const router = useRouter()

    const handleSubmit = async (data: FormData) => {
        setIsPending(true)

        const email = data.get('email') as string
        const name = data.get('firstname') as string + ' ' + data.get('lastname') as string
        const password = data.get('password') as string
        const username = name.replace(' ', '').trim().toLowerCase()

        try {
            await client.signUp.email({
                name: name.trim(),
                email: email.trim(),
                password,
                username,
                displayUsername: name.trim()
                // callbackURL: '/dashboard'
            })
            router.push('/dashboard')
        } catch (error) {
            console.error(error)
        } finally {
            setIsPending(false)
        }
    }

    return (
        <form action={handleSubmit} className="w-full h-full flex flex-col gap-4 items-center justify-center">
            <div className="h-10 w-10 text-center rounded-full gradient-1" />
            <h1 className="mb-8 text-3xl font-semibold">Let's Get Started !</h1>
            {/* {data ?
                <p className='p-4 bg-red-800 text-white rounded'>{data?.error.message} </p> : null
            } */}
            <FormInput
                label="Firstname"
                name="firstname"
            />
            <FormInput
                label="Lastname"
                name="lastname"
            />
            <FormInput
                label="Password"
                name="password"
                type="password"
            />
            <FormInput
                label="Email"
                name="email"
                type="email"
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