import { NextRequest, NextResponse } from "next/server";
import {auth, currentUser} from "@clerk/nextjs/server";
import { connectToDatabase } from "@/lib/mongoose";

import User from "@/models/User";
import Link from "@/models/Link";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectToDatabase();
    const mongoUser = await User.findOne({ clerkId: userId });
    if (!mongoUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let payload: any = {};
    try {
      payload = await req.json();
    } catch {}

      console.log(payload)

    const videoUrl = typeof payload?.videoUrl === "string" && payload.videoUrl.length > 0 ? payload.videoUrl : undefined;
    const clientName = typeof payload?.clientName === "string" && payload.clientName.length > 0 ? payload.clientName : undefined;
    const linkMessage = typeof payload?.oneTimeLinkMessage === "string" && payload.oneTimeLinkMessage.length > 0 ? payload.oneTimeLinkMessage : undefined;

    const link = await Link.create({
      user: mongoUser._id,
      videoUrl,
      clientName,
      linkMessage,

    });

    return NextResponse.json(
      {
        id: link.id,
        user: mongoUser.id,
        videoUrl: link.videoUrl ?? null,
        createdAt: link.createdAt,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error creating link:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export async function PUT(req: NextRequest) {
    try {
        const { link_id, videoUrl, thumbUrl, editToken } = await req.json();

        await connectToDatabase();
        const link = await Link.findById(link_id);
        if (!link) return NextResponse.json({ error: "Link Not found" }, { status: 404 });

        link.videoUrl = videoUrl;
        link.thumbUrl = thumbUrl;
        await link.save();



        return NextResponse.json({ success: true });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}


export async function DELETE(req: NextRequest) {
    try {
        await connectToDatabase();
        const { link_id } = await req.json();
        const user = await currentUser();
        const id = user?.privateMetadata.id;

        const link = await Link.findById(link_id);


        if(link?.user == id) {
            const deletedLink = await Link.findByIdAndDelete(link_id);

            return NextResponse.json({message:"deleted"}, {status: 200})
        } else {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
    }catch (e) {
        console.error("Error finding link:", e);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}