import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";

import {
    bearer,
    admin,
    multiSession,
    twoFactor,
    oneTap,
    oAuthProxy,
    phoneNumber,
    emailOTP
} from "better-auth/plugins";

import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema/auth-schema";
import { sendEmailOTP, sendSMSOTP } from "@/actions/otp";
import { isValidPhoneNumber } from "./utils";

export const auth = betterAuth({
    appName: "Better Auth Demo",
    trustedOrigins: ['http://192.168.33.247:3000', 'http://localhost:3000'],
    database: drizzleAdapter(db, {
        provider: "pg", // or "pg" or "mysql"
        schema: schema
    }),
    emailVerification: {
        // async sendVerificationEmail({ user, url }) {
        //     const res = await resend.emails.send({
        //         from,
        //         to: to || user.email,
        //         subject: "Verify your email address",
        //         html: `<a href="${url}">Verify your email address</a>`,
        //     });
        //     console.log(res, user.email);
        // },
    },
    account: {
        accountLinking: {
            trustedProviders: ["google", "github", "demo-app"],
        },
    },
    emailAndPassword: {
        enabled: true,
        // async sendResetPassword({ user, url }) {
        //     await resend.emails.send({
        //         from,
        //         to: user.email,
        //         subject: "Reset your password",
        //         react: reactResetPasswordEmail({
        //             username: user.email,
        //             resetLink: url,
        //         }),
        //     });
        // },
    },
    socialProviders: {
        // google: {
        //     clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
        //     clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        // },
    },
    plugins: [
        twoFactor({
            otpOptions: {
                async sendOTP({ user, otp }) {
                    sendEmailOTP(user.email, otp)
                },
            },
        }),
        bearer(),
        admin({
            adminUserIds: ["EXD5zjob2SD6CBWcEQ6OpLRHcyoUbnaB"],
        }),
        multiSession(),
        oAuthProxy(),
        nextCookies(),
        oneTap(),
        phoneNumber({
            sendOTP: ({ phoneNumber, code }, request) => {
                sendSMSOTP(phoneNumber, code)
            },
            signUpOnVerification: {
                getTempEmail: (phoneNumber) => {
                    return `${phoneNumber}@klaxix.com`
                },
                getTempName: (phoneNumber) => {
                    return phoneNumber
                }
            },
            phoneNumberValidator(phoneNumber) {
                return isValidPhoneNumber(phoneNumber)
            },
        }),

        emailOTP({
            async sendVerificationOTP({ email, otp, type }) {
                sendEmailOTP(email, otp, type)
            }
        }),
        // customSession(async (session) => {
        //     const data = await db.query.user.findFirst({
        //         where: eq(user.id, session.user.id)
        //     })
        //     return {
        //         ...session,
        //         user: {
        //             ...session.user,
        //             isFirstConnection: data?.isFirstConnection,
        //         },
        //     };
        // }),
    ],
    user: {
        additionalFields: {
            firstname: {
                type: "string",
                required: false,
                input: true
            },
            lastname: {
                type: "string",
                required: false,
                input: true
            }
        }
    },
});