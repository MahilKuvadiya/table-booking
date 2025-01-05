import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const dataFilePath = path.join('/tmp', 'bookings.json')

async function getBookings() {
  const fileContents = await fs.readFile(dataFilePath, 'utf8')
  return JSON.parse(fileContents)
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const bookings = await getBookings()
  const booking = bookings.find((b: any) => b.id === id)
  
  if (booking) {
    return NextResponse.json(booking)
  } else {
    return NextResponse.json({ message: 'Booking not found' }, { status: 404 })
  }
}

