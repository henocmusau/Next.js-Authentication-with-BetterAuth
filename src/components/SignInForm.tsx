'use client'
import React, { ChangeEvent, useActionState, useRef, useState } from 'react'
import FormInput from './FormInput'
import { SignInUsername } from '@/actions/auth'
import { BetterClientError, client } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { APIError } from 'better-auth/api'
import SubmitButton from './SubmitButton'
import { Phone } from 'lucide-react'
import { GSSP_NO_RETURNED_VALUE } from 'next/dist/lib/constants'

const isValidEmail = (email: string) => {
    console.log('Email check')
    return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email.toLowerCase())
}
const isValidPhoneNumber = (phone: string) => {
    const regex = /^(?:\+243|0)(?:[\s.-]?[0-9]{6,12})$/
    return regex.test(phone)
}

const cleanPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/[^\d+]/g, '')

    if (cleaned.startsWith('+243')) {
        return cleaned
    } else if (cleaned.startsWith('243')) {
        return `+${cleaned}`
    }
    else if (cleaned.startsWith('0')) {
        return `+243${cleaned.substring(1)}`
    }
    else {
        return `+243${cleaned}`
    }
}

export default function SignInForm() {
    const [pending, setPending] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [activeOTP, setActiveOTP] = useState(false)
    const [id, setId] = useState('')
    const [otp, setOtp] = useState('')
    const router = useRouter()

    const handleIdChange = (e: ChangeEvent<HTMLInputElement>) => setId(e.target.value)
    const handleOtpChange = (e: ChangeEvent<HTMLInputElement>) => setOtp(e.target.value)

    const handleSubmit = async (data: FormData) => {
        setPending(true)

        console.log(id)
        console.log(isValidEmail(id), 'Phone:', isValidPhoneNumber(id))

        if (activeOTP) return handleOTPVerified(otp.trim())

        // const id = data.get('id') as string
        if (!isValidEmail(id.trim()) && !isValidPhoneNumber(id.trim())) return setError('Invalid Email or Phone number')

        if (isValidEmail(id)) {
            try {
                await client.emailOtp.sendVerificationOtp({
                    email: id.toLowerCase().trim(),
                    type: "sign-in" // or "email-verification", "forget-password"
                }, {
                    onError(ctx) { setError(ctx.error.message) },
                    onSuccess: () => setActiveOTP(true)
                })
            } finally {
                setPending(false)
            }
        } else {
            const phone = cleanPhoneNumber(id)
            try {
                await client.phoneNumber.sendOtp({
                    phoneNumber: phone
                }, {
                    onError(ctx) { setError(ctx.error.message) },
                    onSuccess: () => setActiveOTP(true)
                })
            } finally {
                setPending(false)
            }
        }
    }

    const handleOTPVerified = async (otp: string) => {
        if (!isValidEmail(id.trim()) && !isValidPhoneNumber(id.trim())) return setError('Invalid Email or Phone number')

        if (isValidPhoneNumber(id.trim())) {
            const phone = cleanPhoneNumber(id)

            try {
                await client.phoneNumber.verify({
                    phoneNumber: phone,
                    code: otp
                }, {
                    onError(ctx) { setError(ctx.error.message) },
                    onSuccess: () => router.push('/dashboard')
                })
            } finally {
                setPending(false)
            }
        } else {
            try {
                await client.signIn.emailOtp({
                    email: id.toLowerCase(),
                    otp: otp
                }, {
                    onError(ctx) { setError(ctx.error.message) },
                    onSuccess: () => router.push('/dashboard')
                })
            } finally {
                setPending(false)
            }
        }
    }

    const fields = activeOTP ?
        <>
            <FormInput
                label="Entrez le code"
                name="otp"
                value={otp}
                onChange={handleOtpChange}
            />
            <SubmitButton text='Vérifier le code' />
        </> :
        <>
            <FormInput
                label="Email or Phone"
                name="id"
                value={id}
                onChange={handleIdChange}
            />
            {/* <FormInput
                label="Password"
                name="password"
                type="password"
            /> */}
            <SubmitButton text='Sign In' />
        </>

    return (
        <form action={handleSubmit} className="w-full h-full flex flex-col gap-4 items-center justify-center">
            <div className="h-20 w-20 mb-4 text-center rounded-full gradient-1" />
            <h1 className="mb-4 text-3xl font-semibold">Welcome back !</h1>
            {error ? <p className="bg-red-800/40 w-full mb-4 text-center text-slate-300 rounded p-2">{error} </p> : null}
            {fields}
        </form>
    )
}
