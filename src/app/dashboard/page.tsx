import Image from "next/image";
import SignOut from "../sign-in/SignOut";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import CertificationBadge from "@/components/CertificationBadge";

export default async function Dashboard() {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    const user = session?.user
    if (!user) redirect('/sign-in')
    console.log(user.isFirstConnection)
    return (
        <div className="grid grid-rows-[20px_1fr_20px] justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-[32px] row-start-2 items-center justify-center sm:items-start">

                <div className="flex flex-col items-center w-full h-full">
                    <div className="h-20 w-20 mb-4 text-center rounded-full gradient-1 flex items-center justify-center uppercase">
                        <p className="uppercase text-4xl font-bold">{user.name.charAt(0) || user.email.charAt(0)}</p>
                    </div>
                    <h1 className="text-xl font-semibold capitalize flex">{user.name || user.email.split('@')[0]}
                        {user.emailVerified ? <span>
                            <CertificationBadge />
                        </span> : null}
                    </h1>
                    <p className=" text-sm text-blue-300">{user.email ?? '@' + user.name.replace(' ', '')}</p>
                </div>
                <SignOut />
            </main>
        </div>
    );
}
