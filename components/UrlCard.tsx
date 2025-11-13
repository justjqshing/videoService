"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {Spinner} from "@/components/ui/spinner";
import {toast} from "sonner";

interface UrlCardProps {
    _id: string;
    user: string;
    videoUrl?: string;
    thumbUrl?: string;
    createdAt?: Date;
    clientName?: string;
}

const UrlCard = ({ videoUrl, createdAt, thumbUrl, clientName, _id }: UrlCardProps) => {
    const [IsDeleted, setIsDeleted] = useState(false);
    const router = useRouter();


    async function deleteUrl() {

        try {
            const deletePromise = fetch(`/api/db/links`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ link_id: _id }),
            });
            toast.promise(deletePromise, {
                loading: 'Deleting...',
                success: () => {
                    router.refresh();
                    return 'Link deleted!';
                },
                error: 'Error deleting link',
                style: {
                    background: 'hsl(358, 76%, 10%)',
                    border: 'hsl(359, 100%, 80%)',
                    color: 'hsl(359, 100%, 80%)',
                    fontWeight: 'bold',
                },
            });

        } catch (err) {
            console.error("Error deleting link:", err);
            setIsDeleted(false);
        }
    }


    return (
        <div className="w-full rounded-xl shadow-md overflow-hidden border border-gray-200 bg-black hover:shadow-lg transition-shadow duration-300">
            <div className="relative w-full h-60">
                <a href={videoUrl} target="_blank" rel="noopener noreferrer">
                    <Image
                        src={thumbUrl || "/placeholder-image.jpg"}
                        alt="Video Thumbnail"
                        fill
                        className="object-cover"
                    />
                </a>
            </div>

            <div className="p-2">
                {clientName ? (
                    <p className="text-white text-lg font-bold truncate" title={videoUrl}>
                        {clientName}
                    </p>
                ) : (
                    <p className="text-white text-lg font-bold truncate">No video URL available</p>
                )}
                {createdAt && (
                    <p className="text-gray-200 text-md mt-1">
                        {new Date(createdAt).toLocaleString()}
                    </p>
                )}
                <div className="flex  gap-5">
                <Button variant="default" className="mt-2 hover:cursor-pointer" onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/link/` + _id); toast.info("Copied to clipboard!"); }}>
                    Copy Url
                </Button>
                <Button variant="destructive" className="mt-2 hover:cursor-pointer" onClick={deleteUrl}>
                    {IsDeleted ? <Spinner /> : ""}
                    Delete
                </Button>

                </div>
            </div>
        </div>
    );
};

export default UrlCard;
