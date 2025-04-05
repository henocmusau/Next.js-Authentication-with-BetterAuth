import Image from "next/image";
import SignOut from "../sign-in/SignOut";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Dashboard() {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">

                <h1 className="font-semibold text-4xl">CONNECTED</h1>
                <SignOut />
                <div>
                    <pre>
                        <code>
                            {JSON.stringify(session?.user, null, 2)}
                        </code>
                    </pre>
                </div>
            </main>

        </div>
    );
}
