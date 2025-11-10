import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Link from "@/models/Link";

export async function GET(req: NextRequest, { params }: { params: Promise<{ link_id: string }> }) {
    try {
        const action = req.headers.get("Action");
        if (action === "islinkactive") {

            const { link_id } = await params;
            console.log("link_id:", link_id);

            if (!link_id) {
                return NextResponse.json({ error: "link_id is required" }, { status: 400 });
            }

            await connectToDatabase();

            const islinkactive = await Link.findOne({
                _id: link_id,
                videoUrl: { $ne: null },
            });

            return NextResponse.json({ islinkactive }, { status: 200 });

        }
        if (action === "doeslinkexist") {

            const { link_id } = await params;
            console.log("link_id:", link_id);

            if (!link_id) {
                return NextResponse.json({ error: "link_id is required" }, { status: 400 });
            }

            await connectToDatabase();

            const islinkactive = await Link.findOne({
                _id: link_id,
            });

            return NextResponse.json({ islinkactive }, { status: 200 });

        }
    } catch (e) {
        console.error("Error finding link:", e);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
