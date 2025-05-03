import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";

import {
    bearer,
    admin,
    multiSession,
    organization,
    twoFactor,
    oneTap,
    oAuthProxy,
    openAPI,
    oidcProvider,
    customSession,
    username,
    phoneNumber,
    emailOTP
} from "better-auth/plugins";

import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema/auth-schema";
import { sendEmailOTP, sendSMSOTP } from "@/actions/otp";
import { user } from "../../auth-schema";

export const auth = betterAuth({
    appName: "Better Auth Demo",
    trustedOrigins: ['http://192.168.26.246:3000', 'http://localhost:3000'],
    // database: new Pool({
    //     connectionString: "postgres://postgres:1963@localhost:5432/better"
    // }),
    // database: new Database("better.sqlite"),
    database: drizzleAdapter(db, {
        provider: "pg", // or "pg" or "mysql"
        schema: schema
    }),
    // database: createPool({
    //     host: "localhost",
    //     user: "root",
    //     password: "1963",
    //     database: "better",
    // }),
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
        organization({
            // async sendInvitationEmail(data) {
            //     await resend.emails.send({
            //         from,
            //         to: data.email,
            //         subject: "You've been invited to join an organization",
            //         react: reactInvitationEmail({
            //             username: data.email,
            //             invitedByUsername: data.inviter.user.name,
            //             invitedByEmail: data.inviter.user.email,
            //             teamName: data.organization.name,
            //             inviteLink:
            //                 process.env.NODE_ENV === "development"
            //                     ? `http://localhost:3000/accept-invitation/${data.id}`
            //                     : `${process.env.BETTER_AUTH_URL ||
            //                     "https://demo.better-auth.com"
            //                     }/accept-invitation/${data.id}`,
            //         }),
            //     });
            // },
        }),
        twoFactor({
            // otpOptions: {
            //     async sendOTP({ user, otp }) {
            //         await resend.emails.send({
            //             from,
            //             to: user.email,
            //             subject: "Your OTP",
            //             html: `Your OTP is ${otp}`,
            //         });
            //     },
            // },
        }),
        username(),
        // passkey(),
        openAPI(),
        bearer(),
        admin({
            adminUserIds: ["EXD5zjob2SD6CBWcEQ6OpLRHcyoUbnaB"],
        }),
        multiSession(),
        oAuthProxy(),
        nextCookies(),
        oidcProvider({
            loginPage: "/sign-in",
        }),
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
            }
        }),

        emailOTP({
            async sendVerificationOTP({ email, otp, type }) {
                sendEmailOTP(email, otp, type)
            }
        }),
        customSession(async (session) => {
            const data = await db.select().from(user)
            return {
                ...session,
                user: {
                    ...session.user,
                    isFirstConnection: user.isFirstConnection,
                },
            };
        }),
    ],
    user: {
        additionalFields: {
            isFirstConnection: {
                type: "boolean",
                required: false,
                defaultValue: true,
                input: false
            }
        }
    },
});