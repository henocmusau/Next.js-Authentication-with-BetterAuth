'use server'

import { EmailType, SendConfirmationEmail } from "@/lib/resend"
import { sendOTP } from "@/lib/twilio"

export async function sendSMSOTP(phoneNumber: string = '+243998641860', otp: string) {
    try {
        const data = await sendOTP(phoneNumber, otp)
        if (data.errorCode) throw new Error(data.errorMessage)
        console.log(data)
        return data
    } catch (error) {
        console.error(error)
        throw new Error(error as any)
    }
}

export async function sendEmailOTP(recipient: string, otp: string, type: EmailType = "email-verification") {
    try {
        const { error, data } = await SendConfirmationEmail(recipient, otp, type)
        if (error) throw new Error(error as any)
        console.log(data)
        return data
    } catch (error: any) {
        console.error(error.message)
        throw new Error(error.message)
    }
}
