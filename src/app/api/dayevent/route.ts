import { NextResponse } from 'next/server'
import { prisma } from '../../../../prisma/client';

export async function GET(req: any, res: any) {


    try {
        const events = await prisma.dayEvent.findMany({
            include: {
                event: true,
            },
        });
        return NextResponse.json(events);
    } catch (error) {
        console.error("Error fetching days events:", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    } finally {
        await prisma.$disconnect()
    }
}

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const { day, month, year } = data;
        const event = await prisma.dayEvent.upsert({
            where: {
                day_month_year: {
                    day: Number(day),
                    month: Number(month),
                    year: Number(year)
                }
            },
            update: { ...data },
            create: { ...data }
        });
        const createdEvent = await prisma.dayEvent.findUnique({
            where: {
                day_month_year: {
                    day: Number(day),
                    month: Number(month),
                    year: Number(year)
                }
            },
            include: {
                event: true
            }
        });
        return NextResponse.json(createdEvent);
    }
    catch (error) {
        console.error("Error creating day event:", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
    finally {
        await prisma.$disconnect()
    }
}

export async function DELETE(req: Request) {
    try {
        const { day, month, year } = await req.json(); // Assuming you send day, month, and year in the request body
        console.log(day, month, year);
        const deletedEvent = await prisma.dayEvent.delete({
            where: {
                day_month_year: {
                    day: Number(day),
                    month: Number(month),
                    year: Number(year)
                }
            }
        });
        return new Response(null, { status: 204 }); // Return a response with status code 204 and no body
    } catch (error) {
        console.error("Error deleting day event:", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    } finally {
        await prisma.$disconnect()
    }
}
