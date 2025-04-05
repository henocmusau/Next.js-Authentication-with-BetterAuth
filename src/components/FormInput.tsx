import React, { InputHTMLAttributes } from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    label: string
}
export default function FormInput(props: Props) {
    const { label, type, name, ...restProps } = props
    return (
        <div className='w-full'>
            <label htmlFor={name}>{label}</label>

            <input
                className='w-full px-4 py-2 rounded shadow-inner bg-blue-600/20 focus:ring-blue-600'
                name={name}
                type={type ?? "text"}
                {...restProps}
            />
        </div>
    )
}
