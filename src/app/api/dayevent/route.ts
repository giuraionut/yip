import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../prisma/client';
import log from '../../logger';

const disconnectPrisma = async () => {
  try {
    await prisma.$disconnect();
  } catch (error) {
    log.error("Error disconnecting Prisma:", error);
  }
};

export async function GET(req: NextRequest) {
  try {
    const events = await prisma.dayEvent.findMany({
      include: { event: true },
    });
    return NextResponse.json(events);
  } catch (error) {
    log.error("Error fetching days events:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  } finally {
    await disconnectPrisma();
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { day, month, year } = data;

    const event = await prisma.dayEvent.upsert({
      where: { day_month_year: { day: Number(day), month: Number(month), year: Number(year) } },
      update: { ...data },
      create: { ...data },
    });

    const createdEvent = await prisma.dayEvent.findUnique({
      where: { day_month_year: { day: Number(day), month: Number(month), year: Number(year) } },
      include: { event: true },
    });

    return NextResponse.json(createdEvent);
  } catch (error) {
    log.error("Error creating day event:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  } finally {
    await disconnectPrisma();
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { day, month, year } = await req.json(); // Assuming you send day, month, and year in the request body
    console.log(day, month, year);

    await prisma.dayEvent.delete({
      where: { day_month_year: { day: Number(day), month: Number(month), year: Number(year) } },
    });

    return new NextResponse(null, { status: 204 }); // Return a response with status code 204 and no body
  } catch (error) {
    log.error("Error deleting day event:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  } finally {
    await disconnectPrisma();
  }
}
