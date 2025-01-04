'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"

export default function BookingForm({ selectedDate, selectedTime, onDateChange } : any) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    date: selectedDate || '',
    time: selectedTime || '',
    guests: '',
    name: '',
    email: '',
    phone: '',
  })

  useEffect(() => {
    setFormData(prev => ({ ...prev, date: selectedDate || '', time: selectedTime || '' }))
  }, [selectedDate, selectedTime])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    let validatedValue = value

    switch (name) {
      case 'guests':
        validatedValue = value.replace(/\D/g, '')
        break
      case 'phone':
        validatedValue = value.replace(/[^\d+]/g, '')
        break
      case 'date':
        onDateChange(value)
        break
    }

    setFormData({ ...formData, [name]: validatedValue })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await axios.post('/api/bookings', formData)
      if (response.status === 201) {
        router.push(`/booking-summary/${response.data.id}`)
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        toast({
          title: "Booking Failed",
          description: "This time slot is already booked. Please select another time.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to create booking. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="date">Date</Label>
          <Input 
            type="date" 
            id="date" 
            name="date" 
            value={formData.date} 
            required 
            onChange={handleChange} 
            className="w-full"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        <div>
          <Label htmlFor="time">Time</Label>
          <Input 
            type="time" 
            id="time" 
            name="time" 
            value={formData.time} 
            required 
            onChange={handleChange} 
            className="w-full"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="guests">Number of Guests</Label>
        <Input 
          type="text" 
          id="guests" 
          name="guests" 
          value={formData.guests} 
          required 
          onChange={handleChange} 
          className="w-full" 
          pattern="\d*"
          min="1"
          max="10"
        />
      </div>
      <div>
        <Label htmlFor="name">Name</Label>
        <Input 
          type="text" 
          id="name" 
          name="name" 
          value={formData.name} 
          required 
          onChange={handleChange} 
          className="w-full"
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input 
          type="email" 
          id="email" 
          name="email" 
          value={formData.email} 
          required 
          onChange={handleChange} 
          className="w-full"
        />
      </div>
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input 
          type="tel" 
          id="phone" 
          name="phone" 
          value={formData.phone} 
          required 
          onChange={handleChange} 
          className="w-full" 
          pattern="[0-9+]+"
        />
      </div>
      <Button type="submit" className="w-full">Book Table</Button>
    </form>
  )
}

