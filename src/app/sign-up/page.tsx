import Image from "next/image";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import FormInput from "@/components/FormInput";

import img1 from '@/assets/images/bg.webp'
import SignUpForm from "@/components/SignUpForm";

export default async function SignIn() {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (session) redirect('/dashboard')

    return (
        <div className="flex grow h-full ">
            <section className="basis-1/2 lg:basis-2/3 h-dvh hidden md:flex md:flex-col">
                <Image
                    src={img1}
                    alt="Background"
                    className="object-cover bg-cover object-center h-full w-full"
                />
            </section>
            <section className="basis-full md:basis-1/2 lg:basis-1/3 h-full p-8 md:pt-8 md:px-16 text-slate-300">
                <SignUpForm />
                <p className="text-center mt-4">Already have an account ? {' '}
                    < Link href={'/sign-in'} className="underline text-purple-300 decoration-purple-300 ">
                        Sign in
                    </Link>
                </p>
            </section>
        </div>
    );
}
