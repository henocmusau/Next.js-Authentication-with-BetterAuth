import { Twilio } from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const SENDER = process.env.TWILIO_PHONE_NUMBER

const client = new Twilio(accountSid, authToken)

export const sendOTP = async (phoneNumber: string = '+243998641860', otp: string) => {
    return await client.messages
        .create({
            body: `Votre code de vérification est ${otp} `,
            from: SENDER,
            to: phoneNumber
        })
}