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
    const events = await prisma.event.findMany();
    return NextResponse.json(events);
  } catch (error) {
    log.error("Error fetching events:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  } finally {
    await disconnectPrisma();
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    log.info("Creating event with data:", data);
    const event = await prisma.event.create({ data });
    return NextResponse.json(event);
  } catch (error) {
    log.error("Error creating event:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  } finally {
    await disconnectPrisma();
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) {
      return new NextResponse("Bad Request", { status: 400 });
    }

    const relatedDayMoods = await prisma.dayEvent.findMany({
      where: { eventId: Number(id) },
    });
    if (relatedDayMoods.length > 0) {
      return new NextResponse(JSON.stringify({ message: "Event is used by one or more days" }), { status: 400 });
    }

    await prisma.event.delete({ where: { id: Number(id) } });
    return new NextResponse("Event deleted successfully", { status: 200 });
  } catch (error) {
    log.error("Error deleting event:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  } finally {
    await disconnectPrisma();
  }
}
