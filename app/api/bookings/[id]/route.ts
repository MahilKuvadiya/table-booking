import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const dataFilePath = path.join('/tmp', 'bookings.json');

async function ensureFileExists() {
  try {
    await fs.access(dataFilePath);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      await fs.writeFile(dataFilePath, JSON.stringify([]), 'utf8');
    } else {
      throw error;
    }
  }
}

async function getBookings() {
  await ensureFileExists();
  const fileContents = await fs.readFile(dataFilePath, 'utf8');
  return JSON.parse(fileContents);
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const bookings = await getBookings();
  const booking = bookings.find((b: { id: string }) => b.id === id);

  if (booking) {
    return NextResponse.json(booking);
  }

  return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
}
