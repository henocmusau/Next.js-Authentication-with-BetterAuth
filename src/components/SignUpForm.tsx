'use client'
import React, { useActionState, useRef, useState } from 'react'
import FormInput from './FormInput'
import { SignUpUsername } from '@/actions/auth'
import { client } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import SubmitButton from './SubmitButton'
import useAuth from '@/hooks/useAuth'
import GoogleAuthButton from './GoogleAuthButton'

export default function SignUpForm() {
    const { error, id, lastname, firstname, password, handleSignUp, handleFirstnameChange, handleIdChange, handlePasswordChange, handleLastnameChange } = useAuth(true)

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
    //             label="Firstname"
    //             name="firstname"
    //             value={firstname}
    //             onChange={handleFirstnameChange}
    //         />
    //         <FormInput
    //             label="Lastname"
    //             name="lastname"
    //             value={lastname}
    //             onChange={handleLastnameChange}
    //         />
    //         <FormInput
    //             label="Email or Phone number"
    //             name="id"
    //             value={id}
    //             onChange={handleIdChange}
    //         />
    //         <SubmitButton text='Sign Up' />
    //     </>

    return (
        <>
            <form action={handleSignUp} className="w-full h-full flex flex-col gap-4 items-center justify-center">
                <div className="h-10 w-10 text-center rounded-full gradient-1" />
                <h1 className="mb-4 text-3xl font-semibold">Let's Get Started !</h1>
                {error ? <p className="bg-red-800/40 w-full mb-4 text-center text-slate-300 rounded p-2">{error} </p> : null}
                <FormInput
                    label="Firstname"
                    name="firstname"
                    value={firstname}
                    onChange={handleFirstnameChange}
                />
                <FormInput
                    label="Lastname"
                    name="lastname"
                    value={lastname}
                    onChange={handleLastnameChange}
                />
                <FormInput
                    label="Email or Phone number"
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
                <SubmitButton text='Sign Up' />
            </form>
            <p className='separator'>OR</p>
            <GoogleAuthButton />
        </>
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