import { Resend } from "resend";
import EmailOTP from "./email";

const resend = new Resend(process.env.RESEND_API_KEY);

const SENDER = 'Klaxix <klaxix@resend.dev>'

export type EmailType = "sign-in" | "email-verification" | "forget-password"

export async function SendConfirmationEmail(recipient: string, otp: string, type: EmailType) {
    return await resend.emails.send({
        from: SENDER,
        to: recipient,
        subject: getEmailSubject(type),
        react: EmailOTP({ type, otp })
    });
}

const getEmailSubject = (type: EmailType): string => {
    if (type === 'sign-in') {
        return 'Votre code de connexion'
    } else if (type === 'email-verification') {
        return "Veuillez vérifier votre adresse e-mail"
    } else {
        return "Réinitialisation de votre mot de passe"
    }
}