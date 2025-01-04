'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

async function fetchAvailability(date: string) {
  try {
    const response = await axios.get(`/api/bookings?date=${date}`)
    const bookings = response.data

    // Generate time slots from 18:00 to 22:00
    const timeSlots = Array.from({ length: 9 }, (_, i) => {
      const hour = Math.floor(i / 2) + 18
      const minute = i % 2 === 0 ? '00' : '30'
      return `${hour.toString().padStart(2, '0')}:${minute}`
    })

    return timeSlots.map(time => ({
      time,
      available: !bookings.some((booking: any) => booking.time === time)
    }))
  } catch (error) {
    console.error('Error fetching availability:', error)
    return []
  }
}

export default function AvailabilityDisplay({ onSlotSelect, selectedDate, onDateChange } : any) {
  const [availability, setAvailability] = useState<{ time: string; available: boolean }[]>([])
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date().toISOString().split('T')[0])

  useEffect(() => {
    fetchAvailability(currentDate).then(setAvailability)
  }, [currentDate])

  const handleDateChange = (increment: number) => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + increment)
    const formattedDate = newDate.toISOString().split('T')[0]
    setCurrentDate(formattedDate)
    onDateChange(formattedDate)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl">Available Time Slots</CardTitle>
        <div className="flex justify-between items-center">
            {new Date(currentDate) > new Date() ? (
              <Button onClick={() => handleDateChange(-1)}>&lt;</Button>
            ) : (
              <Button onClick={() => handleDateChange(-1)} disabled>&lt;</Button>
            )}
          <span>{new Date(currentDate).toLocaleDateString()}</span>
          <Button onClick={() => handleDateChange(1)}>&gt;</Button>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {availability.map((slot) => (
            slot.available && (
              <li key={slot.time}>
                <Button
                  onClick={() => onSlotSelect(currentDate, slot.time)}
                  className="w-full p-2 text-center text-sm sm:text-base"
                >
                  {slot.time}
                </Button>
              </li>
            )
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

