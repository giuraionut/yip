import { NextResponse } from 'next/server'
import { prisma } from '../../../../prisma/client';

export async function GET(req: any, res: any) {


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
    try {
        const data = await req.json();
        const mood = await prisma.dayMood.create({ data });
        const createdMood = await prisma.dayMood.findUnique({
            where: { id: mood.id },
            include: {
                mood: true
            }
        });
        return NextResponse.json(createdMood);
    }
    catch (error) {
        console.error("Error creating day mood:", error)
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
        const deletedMood = await prisma.dayMood.delete({
            where: {
                unique_day_month_year: {
                    day: Number(day),
                    month: Number(month),
                    year: Number(year)
                }
            }
        });
        return new Response(null, { status: 204 }); // Return a response with status code 204 and no body
    } catch (error) {
        console.error("Error deleting day mood:", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    } finally {
        await prisma.$disconnect()
    }
}
