'use client'
import { client, signIn, signOut, signUp, updateUser } from '@/lib/auth-client'
import { cleanPhoneNumber, isValidEmail, isValidPhoneNumber } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import React, { ChangeEvent, useState } from 'react'


export default function useAuth(isSignUp?: boolean) {
    const [pending, setPending] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [activeOTP, setActiveOTP] = useState(false)
    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [password, setPassword] = useState('')
    const [id, setId] = useState('')
    const [otp, setOtp] = useState('')
    const router = useRouter()


    const handleFirstnameChange = (e: ChangeEvent<HTMLInputElement>) => setFirstname(e.target.value)
    const handleLastnameChange = (e: ChangeEvent<HTMLInputElement>) => setLastname(e.target.value)
    const handleIdChange = (e: ChangeEvent<HTMLInputElement>) => setId(e.target.value)
    const handleOtpChange = (e: ChangeEvent<HTMLInputElement>) => setOtp(e.target.value)
    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)

    const handleSendOTP = async (data: FormData) => {
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

    const handleSignUp = async (formData: FormData) => {
        setPending(true)

        if (!isValidEmail(id.trim()) && !isValidPhoneNumber(id.trim())) return setError('Invalid Email or Phone number')

        // if (isValidEmail(id)) {
        try {
            await signUp.email({
                email: isValidEmail(id) ? id : `${cleanPhoneNumber(id)}@klaxix.com`,
                password: password,
                name: `${firstname.trim().toLowerCase()} ${lastname.trim().toLowerCase()}`
            }, {
                onError(ctx) { setError(ctx.error.message) },
                onSuccess: async () => {
                    if (isValidEmail(id)) {
                        router.push('/dashboard')
                    } else {
                        await updateUser({
                            phoneNumber: cleanPhoneNumber(id),
                        }, {
                            onSuccess: () => router.push('/dashboard'),
                            onError(ctx) { setError(ctx.error.message) },
                        })
                    }
                }
            })
        } catch (error: any) {
            throw new Error(error.message)
        } finally {
            setPending(false)
        }
        // } else if (isValidPhoneNumber(id)) {
        //     try {
        //         await signIn.phoneNumber({
        //             phoneNumber: id,
        //             password: password,
        //         }, {
        //             onError(ctx) { setError(ctx.error.message) },
        //             onSuccess: (ctx) => updateAfterSignUp()
        //         })
        //     } catch (error: any) {
        //         throw new Error(error.message)
        //     } finally {
        //         setPending(false)
        //     }
        // } else { setError('Enter a valid email or phone number') }
    }

    const handleSignIn = async (formData: FormData) => {
        setPending(true)

        if (!isValidEmail(id.trim()) && !isValidPhoneNumber(id.trim())) return setError('Invalid Email or Phone number')

        if (isValidEmail(id)) {
            try {
                await signIn.email({
                    email: id,
                    password: password,
                }, {
                    onError(ctx) { setError(ctx.error.message) },
                    onSuccess: (ctx) => {
                        console.log(ctx)
                        router.push('/dashboard')
                    }
                })
            } catch (error: any) {
                setError(error.message)
                throw new Error(error.message)
            } finally {
                setPending(false)
            }
        } else if (isValidPhoneNumber(id)) {
            try {
                await signIn.phoneNumber({
                    phoneNumber: cleanPhoneNumber(id),
                    password: password,
                }, {
                    onError(ctx) { setError(ctx.error.message) },
                    onSuccess: (ctx) => {
                        console.log(ctx)
                        router.push('/dashboard')
                    }

                })
            } catch (error: any) {
                setError(error.message)
                throw new Error(error.message)
            } finally {
                setPending(false)
            }
        } else { setError('Enter a valid email or phone number') }
    }

    const handleSignOut = async () => await signOut()

    const updateAfterSignUp = async () => {
        await updateUser({
            name: `${firstname.trim().toLowerCase()} ${lastname.trim().toLowerCase()}`
        }, {
            onError(ctx) { setError(ctx.error.message) },
            onSuccess: (ctx) => router.push('/dashboard')
        })
    }

    const signInWithGoogle = async () => {
        await signIn.social({
            provider: "google"
        }, {
            onError(ctx) { setError(ctx.error.message) },
            onSuccess: (ctx) => router.push('/dashboard')
        })
    }

    const handleOTPVerified = async (otp: string) => {
        if (!isValidEmail(id.trim()) && !isValidPhoneNumber(id.trim())) return setError('Invalid Email or Phone number')

        if (isValidPhoneNumber(id.trim())) {
            const phone = cleanPhoneNumber(id)

            try {
                await client.phoneNumber.verify({
                    phoneNumber: phone,
                    code: otp,
                }, {
                    onError(ctx) { setError(ctx.error.message) },
                    onSuccess: (ctx) => {
                        console.log('context :', ctx.data)
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
                    onSuccess: (ctx) => {
                        router.push('/dashboard')
                    }
                },
                )
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
        password,
        otp: otp.trim(),
        error,
        pending,
        activeOTP,
        name: (firstname.trim() + ' ' + lastname.trim()).toLowerCase(),
        username: firstname.trim().toLowerCase() + lastname.trim().toLowerCase(),
        handleIdChange,
        handleFirstnameChange,
        handleLastnameChange,
        handlePasswordChange,
        handleOtpChange,
        handleSendOTP,
        handleSignUp,
        handleSignIn,
        handleSignOut,
        signInWithGoogle
    }
}
