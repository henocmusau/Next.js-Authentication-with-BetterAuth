'use server'

import { auth } from "@/lib/auth"
import { APIError } from "better-auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export async function SignInUsername(formData: FormData) {
    const username = formData.get('firstname') as string + formData.get('lastname') as string

    try {
        const data = await auth.api.signInUsername({
            body: {
                username,
                password: formData.get('password') as string,
            },
            callbackURL: '/dashboard',
            // headers: headers()
        })

        redirect('/dashboard')
    } catch (error) {
        if (error instanceof APIError) throw new Error(error.message)
    }
}

export async function SignUpUsername(formData: FormData) {
    const username = formData.get('firstname') as string + formData.get('lastname') as string
    const name = formData.get('firstname') as string + formData.get('lastname') as string

    try {
        const data = await auth.api.signInUsername({
            body: {
                username: username.trim(),
                password: formData.get('password') as string,
                email: formData.get('password') as string,
                name: name.trim(),
            },
            callbackURL: '/dashboard',
            // headers: headers()
        })

        redirect('/dashboard')
    } catch (error) {
        if (error instanceof APIError) console.log(error.message, error.status)
    }
}