import mongoose from "mongoose";

// Cached connection to avoid creating multiple connections in Next.js hot reload
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

let cached = (globalThis as any).mongoose as MongooseCache | undefined;

if (!cached) {
  cached = (globalThis as any).mongoose = { conn: null, promise: null } as MongooseCache;
}

export async function connectToDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Missing MONGODB_URI. Add it to your .env.local");
  }

  if (cached!.conn) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    cached!.promise = mongoose.connect(uri, {
      // Add any desired mongoose options here
      // bufferCommands: false,
      // maxPoolSize: 5,
    });
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    cached!.promise = null;
    throw e;
  }

  return cached!.conn;
}
