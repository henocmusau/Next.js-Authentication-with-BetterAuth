'use client'
import React from 'react'
import { useSession } from '@/lib/auth-client'

export default function ViewSession() {
    const { data } = useSession()
    return (
        <div className=' max-w-2xl'>
            <pre>
                <code>
                    {JSON.stringify(data?.session, null, 2)}
                </code>
            </pre>
        </div>
    )
}
