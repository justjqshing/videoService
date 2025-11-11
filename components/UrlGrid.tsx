import UrlCard from "@/components/UrlCard";
import Image from "next/image";
import React from "react";

interface Link {
    _id: string;
    user: string;
    videoUrl?: string;
    thumbUrl?: string;
    createdAt?: Date;
    updatedAt?: Date;
    clientName?: string;
}

interface UrlGridProps {
    plainLinks: Link[];
}


const UrlGrid = ({ plainLinks }: UrlGridProps) => {

    return (
        <div className="grid md:grid-rows-3 grid-cols-3 gap-6 w-full max-w-7xl">

            {plainLinks.map((link) => (
                <div key={link._id} className="h-auto">
                    <UrlCard {...link} />
                </div>
            ))}
        </div>
    );
};

export default UrlGrid;
