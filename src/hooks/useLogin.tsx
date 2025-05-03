'use client'
import { client } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import React, { ChangeEvent, useState } from 'react'


const isValidEmail = (email: string) => {
    return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email.toLowerCase())
}
const isValidPhoneNumber = (phone: string) => {
    const regex = /^(?:\+243|0)?(?:[\s.-]?[0-9]{6,12})$/
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

export default function useLogin() {
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
                const data = await client.signIn.emailOtp({
                    email: id.toLowerCase(),
                    otp: otp
                }, {
                    onError(ctx) { setError(ctx.error.message) },
                    onSuccess: () => router.push('/dashboard')
                })
                console.log(data?.data?.user)
            } finally {
                setPending(false)
            }
        }
    }
    return { activeOTP, id, setId, otp, setOtp, pending, error, handleIdChange, handleOtpChange, handleSubmit }
}
