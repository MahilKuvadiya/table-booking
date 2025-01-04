'use client'

import { useState } from 'react'
import BookingForm from './components/BookingForm'
import AvailabilityDisplay from '@/app/components/AvailabilityDisplay'

export default function Home() {
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')

  const handleSlotSelect = (date: string, time: string) => {
    setSelectedDate(date)
    setSelectedTime(time)
  }

  const handleDateChange = (date: string) => {
    setSelectedDate(date)
    setSelectedTime('')
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-center">Restaurant Table Booking---by Mahil!</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <BookingForm 
          selectedDate={selectedDate} 
          selectedTime={selectedTime} 
          onDateChange={handleDateChange}
        />
        <AvailabilityDisplay 
          onSlotSelect={handleSlotSelect} 
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
        />
      </div>
    </main>
  )
}

