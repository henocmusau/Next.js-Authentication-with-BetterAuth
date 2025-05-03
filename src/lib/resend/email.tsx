import React from 'react'

type EmailProps = {
    type: "sign-in" | "email-verification" | "forget-password"
    otp: string
}

const styleOTP = { fontSize: '1.5 rem', padding: '1 rem', borderRadius: '1 rem', border: '1px solid #0000ff' }

export default function EmailOTP(props: Readonly<EmailProps>) {
    const { type, otp } = props

    if (type === 'sign-in') {
        return (
            <div>
                <p> Bonjour,</p>
                <p>Votre code de connexion unique est :</p>
                <p style={styleOTP}>{otp}</p>
                <p>Veuillez saisir ce code dans l'application/le site web pour accéder à votre compte. Ce code expirera dans 5 minutes.</p>
                <p>Si vous n'avez pas initié cette tentative de connexion, veuillez ignorer cet e-mail.</p>
                <p>Cordialement,</p>
                <p>L'équipe de Support</p>
            </div>
        )
    } else if (type === 'email-verification') {
        return (
            <div>
                <p> Bonjour,</p>
                <p>Merci de vous être inscrit(e) à{' '}<strong>Klaxix</strong> {' '} ! Pour vérifier votre adresse e-mail, veuillez utiliser le code suivant :</p>
                <p style={styleOTP}>{otp}</p>
                <p>Veuillez saisir ce code dans l'application/le site web pour accéder à votre compte. Ce code expirera dans 5 minutes.</p>
                <p>Si vous n'avez pas initié cette tentative de connexion, veuillez ignorer cet e-mail.</p>
                <p>Cordialement,</p>
                <p>L'équipe de Support</p>
            </div>
        )
    } else {
        return (
            <div>
                <p> Bonjour,</p>
                <p>Vous avez demandé à réinitialiser votre mot de passe. Veuillez utiliser le code suivant :</p>
                <p style={styleOTP}>{otp}</p>
                <p>Veuillez saisir ce code dans l'application/le site web pour accéder à votre compte. Ce code expirera dans 5 minutes.</p>
                <p>Si vous n'avez pas initié cette tentative de connexion, veuillez ignorer cet e-mail.</p>
                <p>Cordialement,</p>
                <p>L'équipe de Support</p>
            </div>
        )
    }
}
