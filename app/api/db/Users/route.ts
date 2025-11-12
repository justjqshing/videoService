import {NextRequest, NextResponse} from "next/server";
import {connectToDatabase} from "@/lib/mongoose";
import User from "@/models/User";
import {currentUser} from "@clerk/nextjs/server";

export async function PUT(req: NextRequest) {
    try {
        let user = await currentUser();
        let id = user?.privateMetadata.id;
        let { user_id , linkMessage} = await req.json()
        if (id !== user_id) {
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }
        if (!linkMessage) {
            return NextResponse.json({error: "Link Message Required"}, {status: 400});
        }
        await connectToDatabase();

        const linkUpdate = await User.findByIdAndUpdate(
            user_id,
            { $set: { linkMessage: linkMessage } },
            { new: true }
        );

        return NextResponse.json({message: linkUpdate}, {status: 200});

    } catch (e) {
        console.error("Error finding link:", e);
        return NextResponse.json({error: "Internal Server Error", success: false });

    }
}

export async function GET(req: NextRequest) {
    try {
        let user = await currentUser();
        let id = user?.privateMetadata.id;

        await connectToDatabase();

        const userLinkMessage = await User.findById(id);

        return NextResponse.json({linkMessage: userLinkMessage?.linkMessage}, {status:200})

    } catch (e) {

    }
}