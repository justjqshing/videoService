import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function GET(req: NextRequest) {
    try {
        const { CLOUDINARY_API_SECRET, CLOUDINARY_API_KEY, NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME } = process.env;

        if (!CLOUDINARY_API_SECRET || !CLOUDINARY_API_KEY || !NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
            return NextResponse.json({ error: "Server not configured" }, { status: 500 });
        }

        const timestamp = Math.floor(Date.now() / 1000);

        const params: Record<string, string> = {
            timestamp: timestamp.toString(),
            upload_preset: "Videos",
        };

        const sortedKeys = Object.keys(params).sort();
        const paramString = sortedKeys
            .map((key) => `${key}=${params[key]}`)
            .join("&");

        const stringToSign = paramString + CLOUDINARY_API_SECRET;

        const signature = crypto.createHash("sha1").update(stringToSign).digest("hex");

        return NextResponse.json({
            signature,
            timestamp,
            upload_preset: "Videos",
            cloud_name: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
            api_key: CLOUDINARY_API_KEY,
        });
    } catch (err: any) {
        console.error("Error generating signature:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
