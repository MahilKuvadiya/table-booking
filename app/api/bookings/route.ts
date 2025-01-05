import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

const dataFilePath = path.join(process.cwd(), '/tmp', 'bookings.json')

async function getBookings() {
  const fileContents = await fs.readFile(dataFilePath, 'utf8')
  return JSON.parse(fileContents)
}

async function saveBookings(bookings: any[]) {
  await fs.writeFile(dataFilePath, JSON.stringify(bookings, null, 2))
}

export async function POST(request: Request) {
  const booking = await request.json()
  const bookings = await getBookings()
  
  // Check if the time slot is already booked
  const isSlotBooked = bookings.some(
    (b: any) => b.date === booking.date && b.time === booking.time
  )

  if (isSlotBooked) {
    return NextResponse.json(
      { message: 'This time slot is already booked' },
      { status: 409 }
    )
  }

  const newBooking = { id: uuidv4(), ...booking }
  bookings.push(newBooking)
  await saveBookings(bookings)
  return NextResponse.json(newBooking, { status: 201 })
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date')
  const bookings = await getBookings()
  const filteredBookings = date 
    ? bookings.filter((booking: any) => booking.date === date)
    : bookings
  return NextResponse.json(filteredBookings)
}

