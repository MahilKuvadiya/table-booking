'use client'

import { useRouter } from 'next/navigation'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from 'react'
import React from 'react'

export default function BookingSummary({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [booking, setBooking] = useState<any>(null)
  const [error, setError] = useState<string>('')

  // Unwrap the `params` promise using React's `use` hook
  const { id } = React.use(params)

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await axios.get(`/api/bookings/${id}`)
        setBooking(response.data)
      } catch (error) {
        setError('Failed to fetch booking details')
      }
    }
    fetchBooking()
  }, [id])

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6">
            <p className="text-center text-red-500">{error}</p>
            <Button onClick={() => router.push('/')} className="mt-4 w-full">
              Return to Booking
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6">
            <p className="text-center">Loading...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl text-center">Booking Confirmation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center">Thank you for your reservation, {booking.name}!</p>
          <p className="text-center">Your booking details:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Date: {booking.date}</li>
            <li>Time: {booking.time}</li>
            <li>Number of guests: {booking.guests}</li>
            <li>Email: {booking.email}</li>
            <li>Phone: {booking.phone}</li>
          </ul>
          <Button 
            onClick={() => router.push('/')} 
            className="w-full mt-6"
          >
            Back to Booking
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
