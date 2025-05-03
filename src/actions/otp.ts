'use server'

import { EmailType, SendConfirmationEmail } from "@/lib/resend"
import { sendOTP } from "@/lib/twilio"

export async function sendSMSOTP(phoneNumber: string = '+243998641860', otp: string) {
    try {
        const data = await sendOTP(phoneNumber, otp)
        console.log(data)
        return data
    } catch (error) {
        console.log(error)
        throw new Error(error as any)
    }
}

export async function sendEmailOTP(recipient: string, otp: string, type: EmailType) {
    try {
        const data = await SendConfirmationEmail(recipient, otp, type)
        console.log(data)
        return data
    } catch (error) {
        console.log(error)
        throw new Error(error as any)
    }
}
