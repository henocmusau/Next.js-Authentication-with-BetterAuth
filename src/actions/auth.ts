'use server'

import { auth } from "@/lib/auth"
import { APIError } from "better-auth/api"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export async function SignInUsername(formData: FormData) {
    const username = formData.get('username') as string

    console.log(formData)

    try {
        const data = await auth.api.signInUsername({
            body: {
                username: username.trim(),
                password: formData.get('password') as string,
            },
            callbackURL: '/dashboard',
            // headers: headers()
        })
        console.log(data)

        redirect('/dashboard')
    } catch (error) {
        if (error instanceof APIError) throw new Error(error.message)
    }
}

export async function SignUpUsername(formData: FormData) {
    const firstname = formData.get('firstname') as string
    const lastname = formData.get('lastname') as string
    const username = firstname.trim() + lastname.trim()
    console.log(username)
    try {
        const data = await auth.api.signInUsername({
            body: {
                username: username.trim(),
                password: formData.get('password') as string,
                email: formData.get('password') as string,
                name: firstname.trim() + ' ' + lastname.trim(),
            },
            callbackURL: '/dashboard',
            // headers: headers()
        })
        console.log(data)

        redirect('/dashboard')
    } catch (error) {
        if (error instanceof APIError) console.log(error.message, error.status)
    }
}