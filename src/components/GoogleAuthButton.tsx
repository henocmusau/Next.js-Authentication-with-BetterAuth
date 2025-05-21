'use client'
import React from 'react'
import GoogleIcon from './GoogleIcon'
import useAuth from '@/hooks/useAuth'

export default function GoogleAuthButton() {
    const { signInWithGoogle } = useAuth()
    return (
        <button type='button' onClick={() => signInWithGoogle()} className='w-full rounded py-2 cursor-pointer border border-indigo-500 relative flex items-center justify-center'>
            <span className='absolute left-4'>
                <GoogleIcon />
            </span>
            <span>Continue with Google</span>
        </button>
    )
}
