import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

export async function GET(req: any, res: any) {
    const prisma = new PrismaClient()

    try {
        const moods = await prisma.dayMood.findMany({
            include: {
                mood: true,
            },
        });
        return NextResponse.json(moods);
    } catch (error) {
        console.error("Error fetching days moods:", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    } finally {
        await prisma.$disconnect()
    }
}

export async function POST(req: Request) {
    const prisma = new PrismaClient()
    try {
        const data = await req.json();
        console.log(data);
        const mood = await prisma.dayMood.create({ data });
        return NextResponse.json(mood);
    }
    catch (error) {
        console.error("Error creating day mood:", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
    finally {
        await prisma.$disconnect()
    }
}
