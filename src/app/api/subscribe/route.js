import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Subscriber from "@/models/Subscriber";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(req) {
  try {
    const { email, source } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    await connectToDatabase();
    
    // Upsert avoids duplicate key errors gracefully
    await Subscriber.findOneAndUpdate(
      { email },
      { $setOnInsert: { email, source: source || "exit-intent" } },
      { upsert: true, returnDocument: 'after' }
    );
    
    // Send automated welcome email
    await sendWelcomeEmail(email);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Subscription failed" }, { status: 500 });
  }
}
