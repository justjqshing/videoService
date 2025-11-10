import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
let clients: { send: (data: any) => void }[] = [];
import { connectToDatabase } from "@/lib/mongoose";
export async function GET(req: NextRequest) {
    const user = await currentUser();
    if (!user?.id) return new Response("Unauthorized", { status: 401 });

    const userId = user.privateMetadata.id as string;

    const stream = new ReadableStream({
        start(controller) {
            const encoder = new TextEncoder();
            const send = (data: any) =>
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));

            clients.push({ send });

            req.signal.addEventListener("abort", () => {
                clients = clients.filter((c) => c.send !== send);
            });
        },
    });

    const mongoose = await connectToDatabase();
    const collection = mongoose.connection.collection("links");

    const pipeline = [
        {
            $match: {
                "fullDocument.user": new mongoose.Types.ObjectId(userId),
                "fullDocument.videoUrl": { $exists: true, $ne: null },
            },
        },
    ];

    const changeStream = collection.watch(pipeline, { fullDocument: "updateLookup" });

    changeStream.on("change", (next) => {
        for (const client of clients) {
            client.send({ _id: next.fullDocument?._id });
        }
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
        },
    });
}
