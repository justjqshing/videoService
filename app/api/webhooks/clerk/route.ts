import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/models/User";
import {clerkClient} from "@clerk/nextjs/server";

// Clerk sends webhooks signed via Svix. We'll verify using CLERK_WEBHOOK_SECRET
export async function POST(req: NextRequest) {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("Missing CLERK_WEBHOOK_SECRET. Add it to your .env.local");
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  // Get Svix headers
  const svix_id = req.headers.get("svix-id");
  const svix_timestamp = req.headers.get("svix-timestamp");
  const svix_signature = req.headers.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: "Missing Svix headers" }, { status: 400 });
  }

  const payload = await req.text();

  // Verify signature
  const wh = new Webhook(webhookSecret);
  let evt: any;
  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.warn("Invalid signature for Clerk webhook", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const eventType = evt.type as string;
  const data = evt.data as any;

  try {
    await connectToDatabase();

    if (eventType === "user.created" || eventType === "user.updated") {

      const primaryEmail = (data.email_addresses?.find((e: any) => e.id === data.primary_email_address_id)?.email_address || data.email_addresses?.[0]?.email_address || null) as string | null;
      console.log(data.email_addresses)
      const checkforsoftdelete = await User.findOneAndUpdate(
            { email: data.email_addresses[0].email_address.toLowerCase()},
            { $set: { deleted: false } },
            { new: true }
        );
      if (checkforsoftdelete) {
        return NextResponse.json({ ok: true, userId: checkforsoftdelete._id?.toString?.() ?? null }, { status: 200 });
      }
      const doc = {
        clerkId: data.id as string,
        email: primaryEmail ? primaryEmail.toLowerCase() : null,
        firstName: (data.first_name as string | null) ?? null,
        lastName: (data.last_name as string | null) ?? null,
        imageUrl: (data.image_url as string | null) ?? null,
        deleted: false,
      };
      const _id = await User.findOneAndUpdate(
        { clerkId: doc.clerkId },
        { $set: doc },
        { upsert: true, new: true },
      );

        if (eventType === "user.created") {
            const clerk = await clerkClient();
            await clerk.users.updateUserMetadata(data.id, {
                privateMetadata: {
                    id: _id?._id
                }
            })
        }

    } else if (eventType === "user.deleted") {
      // Clerk sends data with id of deleted user; mark as deleted (soft delete)
      const clerkId = (data.id as string) ?? "";
      if (clerkId) {
        await User.findOneAndUpdate({ clerkId }, { $set: { deleted: true } });
      }
    }
  } catch (err) {
    console.error("Error processing Clerk webhook:", err);
    return NextResponse.json({ error: "Processing error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}

export async function GET() {
  return NextResponse.json({ status: "ok" });
}
