import React from 'react'
import Image from "next/image";
import Link from 'next/link'
const Nav = () => {
    return (
        <div className={'flex flex-row justify-between w-100vw px-10 py-5'}>
            <Image src={'./vercel.svg'} alt={'alt'} width={'50'} height={'50'}></Image>
            <div className={'content-center justify-center flex'}>
                <Link href="/login" className={'content-center bg-amber-700 rounded-3xl px-5 py-2 hover:bg-amber-600 duration-150'}>Login</Link>

            </div>
        </div>
    )
}
export default Nav
