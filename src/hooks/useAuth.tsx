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

export default function useAuth(isSignUp?: boolean) {
    const [pending, setPending] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [activeOTP, setActiveOTP] = useState(false)
    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [id, setId] = useState('')
    const [otp, setOtp] = useState('')
    const router = useRouter()


    const handleFirstnameChange = (e: ChangeEvent<HTMLInputElement>) => setFirstname(e.target.value)
    const handleLastnameChange = (e: ChangeEvent<HTMLInputElement>) => setLastname(e.target.value)
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
            } catch (error: any) {
                setError(error?.message || error)
                throw new Error(error)

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
            } catch (error: any) {
                setError(error?.message || error)
                throw new Error(error)
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
                    onSuccess: (ctx) => {
                        router.push('/dashboard')
                    }
                })
            } catch (error: any) {
                setError(error?.message || error)
                throw new Error(error)
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
                })
                console.log(data?.data?.user)
            } catch (error: any) {
                setError(error?.message || error)
                throw new Error(error)
            } finally {
                setPending(false)
            }
        }
    }
    return {
        id: id.trim().toLowerCase(),
        firstname,
        lastname,
        otp: otp.trim(),
        error,
        pending,
        activeOTP,
        name: (firstname.trim() + ' ' + lastname.trim()).toLowerCase(),
        username: firstname.trim().toLowerCase() + lastname.trim().toLowerCase(),
        handleIdChange,
        handleFirstnameChange,
        handleLastnameChange,
        handleOtpChange,
        handleSubmit
    }
}
