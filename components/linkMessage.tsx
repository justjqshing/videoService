'use client'
import {Input} from "@/components/ui/input";
import {useState, useEffect} from "react";
import {Button} from "@/components/ui/button";
import {useContext} from "react";
import {toast} from "sonner";
const LinkMessage = ({user_id}: { user_id: string}) => {
    const [message, setMessage] = useState<string>('')
    const [failedToSubmit, setFailedToSubmit] = useState<boolean>(false)
    const [shake, setShake] = useState<boolean>(false)
    const [placeholderMessage, setPlaceholderMessage] = useState<string>('')

    useEffect(() => {
        const fetchPlaceholder = async () => {
            const placeholderMessage = await fetch(`/api/db/Users/${user_id}`, {
                method: 'GET',
            })
            const reso = await placeholderMessage.json()
            console.log(reso)
            setPlaceholderMessage(reso?.linkMessage)
        }

        fetchPlaceholder()


    }, []);

    const submit = async () => {
        if(!message) {
            setShake(true)
            setTimeout(() => {setShake(false)}, 500)
            setTimeout(() => {setFailedToSubmit(false)}, 10000)
            setFailedToSubmit(true)
            toast.error('Please enter a message')
            return

        }


        const update = await fetch('/api/db/Users', {
            method: 'PUT',
            body: JSON.stringify({user_id: user_id, linkMessage: message}),
        })
        const res = await update.json()
        console.log(res)
        if( res.message) {
            toast.success('Link Message Updated')
            setMessage('')
            setPlaceholderMessage(message)
        }


    }
    useEffect(() => {
        setFailedToSubmit(false)
    }, [message])
    return (
        <div className={'flex flex-col gap-5 flex-1 mt-10 w-full items-center'}>
            <h1 className={'font-bold'}>Set Link Message</h1>
            <Input onChange={(e) => setMessage(e.target.value)} value={message} placeholder={`${placeholderMessage ? placeholderMessage : 'Place Holder'}`} className={`${ failedToSubmit && 'border-destructive '} ${shake && 'animate-shake'}`}/>
            <Button onClick={() => submit()} className={'w-full'}>Update Link Message</Button>

        </div>

    )
}
export default LinkMessage
