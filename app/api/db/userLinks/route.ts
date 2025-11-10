import {NextRequest, NextResponse} from "next/server";
import {connectToDatabase} from "@/lib/mongoose";
import Link from "@/models/Link";
import {currentUser} from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
    try{
        await connectToDatabase();

        const User = await currentUser()
        const user_id = User?.privateMetadata.id;
        if(!User) {
           return NextResponse.json({error: "user_id is required"}, {status: 400})
        }
        const links = await Link.find({'user': user_id})
        return NextResponse.json({message:links}, {status: 200})
    } catch (e) {
    console.error("Error finding link:", e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
