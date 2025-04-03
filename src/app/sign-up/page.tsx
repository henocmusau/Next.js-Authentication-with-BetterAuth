import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function SignUp() {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (session) redirect('/dashboard')

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
                <Image
                    className="dark:invert"
                    src="/next.svg"
                    alt="Next.js logo"
                    width={180}
                    height={38}
                    priority
                />
                <h1 className="text-3xl font-bold">Sign Up</h1>

                <Link
                    href='/dashboard'
                    className="bg-blue-600 text-white px-8 py-2 rounded"
                >
                    Go to Dashboard
                </Link>

            </main>

        </div>
    );
}
