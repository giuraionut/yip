import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../prisma/client';
import log from '../../logger';

// Utility function to disconnect Prisma
const disconnectPrisma = async () => {
  try {
    await prisma.$disconnect();
  } catch (error) {
    log.error("Error disconnecting Prisma:", error);
  }
};

export async function GET(req: NextRequest) {
  try {
    const moods = await prisma.dayMood.findMany({
      include: { mood: true },
    });
    return NextResponse.json(moods);
  } catch (error) {
    log.error("Error fetching day moods:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  } finally {
    await disconnectPrisma();
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { day, month, year } = data;
    
    const mood = await prisma.dayMood.upsert({
      where: { day_month_year: { day: Number(day), month: Number(month), year: Number(year) } },
      update: { ...data },
      create: { ...data }
    });

    const createdMood = await prisma.dayMood.findUnique({
      where: { day_month_year: { day: Number(day), month: Number(month), year: Number(year) } },
      include: { mood: true }
    });

    return NextResponse.json(createdMood);
  } catch (error) {
    log.error("Error creating day mood:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  } finally {
    await disconnectPrisma();
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { day, month, year } = await req.json();

    const deletedMood = await prisma.dayMood.delete({
      where: { day_month_year: { day: Number(day), month: Number(month), year: Number(year) } }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    log.error("Error deleting day mood:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  } finally {
    await disconnectPrisma();
  }
}
