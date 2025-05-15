import { createAuthClient } from "better-auth/react";
import {
    organizationClient,
    passkeyClient,
    twoFactorClient,
    adminClient,
    multiSessionClient,
    oneTapClient,
    oidcClient,
    genericOAuthClient,
    usernameClient,
    phoneNumberClient,
    emailOTPClient,
    customSessionClient
} from "better-auth/client/plugins";
import { auth } from "./auth";
// import { toast } from "sonner";
// import { stripeClient } from "@better-auth/stripe/client";

export const client = createAuthClient({
    plugins: [
        // customSessionClient<typeof auth>(),
        twoFactorClient({
            onTwoFactorRedirect() {
                window.location.href = "/two-factor";
            },
        }),
        adminClient(),
        phoneNumberClient(),
        emailOTPClient(),
        genericOAuthClient(),
    ],
    fetchOptions: {
        onError(e) {
            if (e.error.status === 429) {
                // toast.error("Too many requests. Please try again later.");
                console.error("Too many requests. Please try again later.");
            }
        },
    },
});

export const {
    signUp,
    signIn,
    signOut,
    useSession,
    updateUser
} = client;


export type BetterClientError = {
    code?: string | undefined;
    message?: string | undefined;
    t?: boolean | undefined;
    status: number;
    statusText: string;
} | null

client.$store.listen("$sessionSignal", async () => { });