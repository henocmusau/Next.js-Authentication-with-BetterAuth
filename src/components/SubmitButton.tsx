'use client'
import React from 'react'
import { useFormStatus } from 'react-dom'

export default function SubmitButton({ text }: { text: string }) {
    const { pending } = useFormStatus()
    return (
        <button
            type="submit"
            className={`w-full rounded py-2 cursor-pointer ${pending ? 'disabled:bg-neutral-700' : 'gradient-1'} duration-200`}
            disabled={pending}
        >
            {pending ? text + "..." : text}
        </button>
    )
}
