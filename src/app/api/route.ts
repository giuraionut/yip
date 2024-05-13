import { NextResponse } from 'next/server'

export async function GET(req: any, res: any) {
    return NextResponse.json("Hello");
}
