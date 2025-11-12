
import React from 'react'
import Image from "next/image";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import {currentUser} from "@clerk/nextjs/server";

const Nav = async () => {
    const user = await currentUser();
    const id = user?.privateMetadata.id;


    return (
        <div className={'w-full bg-accent'}>
            <div className={'flex flex-row justify-between w-100vw px-10 py-5'}>

            <Image src={'/vercel.svg'} alt={'Vercel Logo'} width={50} height={50} />
            <div className={'content-center justify-center flex gap-3'}>
                <SignedOut>
                    <SignInButton mode="modal" signUpForceRedirectUrl={'/'}>
                        <button className={'content-center bg-amber-700 rounded-3xl px-5 py-2 hover:bg-amber-600 duration-150'}>
                            Sign in
                        </button>
                    </SignInButton>
                    <SignUpButton mode="modal" signInForceRedirectUrl={'/'}>
                        <button className={'content-center bg-amber-700 rounded-3xl px-5 py-2 hover:bg-amber-600 duration-150'}>
                            Sign up
                        </button>
                    </SignUpButton>
                </SignedOut>
                <SignedIn>
                    <Link href={`/${id}/dashboard`} className={'content-center bg-amber-700 rounded-3xl px-5 py-2 hover:bg-amber-600 duration-150'}>
                        Dashboard
                    </Link>
                    <UserButton/>
                </SignedIn>
            </div>

        </div>

        </div>
    )
}
export default Nav
