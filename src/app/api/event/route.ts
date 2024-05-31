import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import { prisma } from '../../../../prisma/client';

export async function GET(req: any, res: any) {

    try {
        const moods = await prisma.event.findMany()
        return NextResponse.json(moods);
    } catch (error) {
        console.error("Error fetching moods:", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    } finally {
        await prisma.$disconnect()
    }
}

export async function POST(req: Request) {
    try {
        const data = await req.json();
        console.log(data);
        const event = await prisma.event.create({ data });
        return NextResponse.json(event);
    }
    catch (error) {
        console.error("Error creating event:", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
    finally {
        await prisma.$disconnect()
    }
}


export async function DELETE(req: Request) {
    try {
        const { id } = await req.json();
        if (!id) {
            return new NextResponse("Bad Request", { status: 400 });
        }

        const relatedDayMoods = await prisma.dayEvent.findMany({
            where: {
                eventId: Number(id),
            },
        });
        if (relatedDayMoods.length > 0) {
            return new NextResponse(JSON.stringify({ message: "Event it is used by one more days" }), { status: 400 })
        }
        await prisma.event.delete({ where: { id: Number(id) } });
        return new NextResponse("Event deleted successfully", { status: 200 });
    } catch (error) {
        console.error("Error deleting event:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
