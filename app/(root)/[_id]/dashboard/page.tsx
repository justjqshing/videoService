import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import GenerateLinkButton from "@/components/GenerateLinkButton";
import { getuserLinks } from "@/lib/actions/userLinks/getuserLinks";
import UrlGrid from "@/components/UrlGrid";
import AutoRefresh from "@/components/Autorefresh";
import Link from "@/models/Link";
import LinkMessage from "@/components/linkMessage";
import RefreshButton from "@/components/refreshButton";
type PageProps = {
    params: Promise<{ _id: string }>;
};

interface Link {
    _id: string;
    user: string;
    videoUrl?: string;
    thumbUrl?: string;
    createdAt?: Date;
    updatedAt?: Date;
    clientName?: string;
}

const Page = async ({ params }: PageProps) => {
    const param = await params;
    const user = await currentUser();
    const id = user?.privateMetadata.id;

    if (param?._id !== id) {
        redirect("/");
    }

    //@ts-ignore
    let links: Link[] = await getuserLinks();
    const plainLinks = links.map((link) => ({
            ...link,
            _id: link._id.toString(),
            user: link.user.toString(),
    }));




    return (

        <div className="flex flex-1 min-h-0 overflow-hidden">
            <div className="w-1/7 border-r-2 border-border flex flex-col p-5  min-h-0">
                <div className="flex-1 flex flex-col justify-between">
                    <div>
                        <h1 className="mb-5 text-lg font-semibold text-center">Utilities</h1>
                            <GenerateLinkButton />
                            <LinkMessage user_id={id} />
                    </div>
                    <RefreshButton />
                </div>
            </div>

            <div className="flex-1 flex flex-col px-5 pt-5 min-h-0 overflow-hidden">
                <div className="flex-1 overflow-y-auto pb-10 overscroll-y-none no-scrollbar">
                    <UrlGrid plainLinks={plainLinks} />
                </div>
            </div>
        </div>


    );
};

export default Page;
