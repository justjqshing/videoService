import {NextRequest} from "next/server";
import {connectToDatabase} from "@/lib/mongoose";
import User from "@/models/User";

export async function GET(req: NextRequest, { params }: { params: Promise<{ user_id: string }> }) {
    try {
        await connectToDatabase();
        const { user_id } = await params;

        if (!user_id) {
            return new Response(JSON.stringify({ error: "user_id is required" }), { status: 400 });
        }
        const Userdata = await User.findById(user_id);
        const link = Userdata?.linkMessage;
        return new Response(JSON.stringify({linkMessage: link}), { status: 200 });
    } catch (e) {
        console.error("Error finding link:", e);
    }


}