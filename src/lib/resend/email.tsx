import React from 'react'

type EmailProps = {
    type: "sign-in" | "email-verification" | "forget-password"
    otp: string
}

const greetStyle = { fontWeight: 'bold', textAlign: 'center' } satisfies React.CSSProperties

export default function EmailOTP(props: Readonly<EmailProps>) {
    const { type, otp } = props

    if (type === 'sign-in') {
        return (
            <div>
                <p style={styles.greet}> Bonjour,</p>
                <p>Votre code de connexion unique est :</p>
                <p style={styles.otp}>{otp}</p>
                <p>Veuillez saisir ce code dans l'application/le site web pour accéder à votre compte. Ce code expirera dans 5 minutes.</p>
                <p>Si vous n'avez pas initié cette tentative de connexion, veuillez ignorer cet e-mail.</p>
                <p>Cordialement,</p>
                <p>L'équipe d'Assistance</p>
            </div>
        )
    } else if (type === 'email-verification') {
        return (
            <div>
                <p style={styles.greet}> Bonjour,</p>
                <p>Merci de vous être inscrit(e) à{' '}<strong>Klaxix</strong> {' '} ! Pour vérifier votre adresse e-mail, veuillez utiliser le code suivant :</p>
                <p style={styles.otp}>{otp}</p>
                <p>Veuillez saisir ce code dans l'application/le site web pour accéder à votre compte. Ce code expirera dans 5 minutes.</p>
                <p>Si vous n'avez pas initié cette tentative de connexion, veuillez ignorer cet e-mail.</p>
                <p>Cordialement,</p>
                <p>L'équipe d'Assistance</p>
            </div>
        )
    } else {
        return (
            <div>
                <p style={styles.greet}> Bonjour,</p>
                <p>Vous avez demandé à réinitialiser votre mot de passe. Veuillez utiliser le code suivant :</p>
                <p style={styles.otp}>{otp}</p>
                <p>Veuillez saisir ce code dans l'application/le site web pour accéder à votre compte. Ce code expirera dans 5 minutes.</p>
                <p>Si vous n'avez pas initié cette tentative de connexion, veuillez ignorer cet e-mail.</p>
                <p>Cordialement,</p>
                <p>L'équipe d'Assistance</p>
            </div>
        )
    }
}

const styles = {
    otp: {
        fontSize: '32px',
        padding: '16px',
        borderRadius: '16px',
        fontWeight: 'bold',
        border: '1px solid #0000ff',
        textAlign: 'center'
    } as React.CSSProperties,
    greet: {
        fontSize: '20px',
        fontWeight: 'bold',
        textAlign: 'center'
    } as React.CSSProperties
} 
