import { NextResponse } from "next/server";

export async function GET() {
    const currentTime = new Date().toISOString();

    return NextResponse.json({
        currentTime: currentTime
    });
}
