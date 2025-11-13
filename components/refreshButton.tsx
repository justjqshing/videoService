'use client'
import { useRouter } from 'next/navigation'
import {Button} from "@/components/ui/button";
const RefreshButton = () => {
    const router = useRouter()
    return (

        <Button onClick={() => router.refresh()} className={'w-full'}>Refresh</Button>
    )
}
export default RefreshButton
