'use client'
import React, { ChangeEvent, useActionState, useRef, useState } from 'react'
import FormInput from './FormInput'
import SubmitButton from './SubmitButton'
import useAuth from '@/hooks/useAuth'
import GoogleAuthButton from './GoogleAuthButton'

export default function SignInForm() {
    const { id, password, error, handleIdChange, handlePasswordChange, handleSignIn } = useAuth()

    // const fields = activeOTP ?
    //     <>
    //         <FormInput
    //             label="Entrez le code"
    //             name="otp"
    //             value={otp}
    //             onChange={handleOtpChange}
    //         />
    //         <SubmitButton text='Vérifier le code' />
    //     </> :
    //     <>
    //         <FormInput
    //             label="Email or Phone"
    //             name="id"
    //             value={id}
    //             onChange={handleIdChange}
    //         />
    //         <SubmitButton text='Sign In' />
    //     </>

    return (
        <>
            <form action={handleSignIn} className="w-full h-full flex flex-col gap-4 items-center justify-center">
                <div className="h-20 w-20 mb-4 text-center rounded-full gradient-1" />
                <h1 className="mb-4 text-3xl font-semibold">Welcome back !</h1>
                {error ? <p className="bg-red-800/40 w-full mb-4 text-center text-slate-300 rounded p-2">{error} </p> : null}
                <FormInput
                    label="Email or Phone"
                    name="id"
                    value={id}
                    onChange={handleIdChange}
                />
                <FormInput
                    label="Password"
                    name="password"
                    type='password'
                    value={password}
                    onChange={handlePasswordChange}
                />
                <SubmitButton text='Sign In' />
            </form>
            <p className='separator'>OR</p>
            <GoogleAuthButton />
        </>
    )
}
