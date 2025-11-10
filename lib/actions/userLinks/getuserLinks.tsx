import {NextRequest, NextResponse} from "next/server";
import {connectToDatabase} from "@/lib/mongoose";
import Link from "@/models/Link";
import {currentUser} from "@clerk/nextjs/server";
export async function getuserLinks() {
    try{
        await connectToDatabase();

        const User = await currentUser()
        const user_id = User?.privateMetadata.id;
        const links = await Link.find({'user': user_id}).lean().sort({createdAt: -1})
        return links
    } catch (e) {
        console.error("Error finding link:", e);
        return [];
    }
}
