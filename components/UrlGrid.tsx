import UrlCard from "@/components/UrlCard";
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-auto gap-6 w-full">

            {plainLinks.map((link) => (
                <div key={link._id}>
                    <UrlCard {...link} />
                </div>
            ))}
        </div>
    );
};

export default UrlGrid;
