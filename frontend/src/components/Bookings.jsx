import { useState, useEffect } from 'react'
import { getBookingsAPI, updateBookingStatusAPI, deleteBookingAPI } from '../api/api'

export default function Bookings() {
  const [bookings, setBookings] = useState([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const response = await getBookingsAPI()
      setBookings(response.data)
    } catch (error) {
      setMessage('❌ Error fetching bookings')
      console.error('Error:', error)
    }
    setLoading(false)
  }

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateBookingStatusAPI(id, status)
      setMessage(`✅ Booking ${status.toLowerCase()}!`)
      fetchBookings()
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('❌ Error updating booking')
      console.error('Error:', error)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await deleteBookingAPI(id)
        setMessage('✅ Booking deleted successfully!')
        fetchBookings()
        setTimeout(() => setMessage(''), 3000)
      } catch (error) {
        setMessage('❌ Error deleting booking')
        console.error('Error:', error)
      }
    }
  }

  return (
    <div>
      <h2>📅 Booking Management</h2>
      
      {message && <div className={message.includes('❌') ? 'error' : 'success'}>{message}</div>}
      
      <div className="card">
        <h3>📋 All Bookings</h3>
        {loading ? (
          <div className="loading">Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <div className="empty-state">
            <p>No bookings found yet.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Resource</th>
                <th>Date</th>
                <th>Time Slot</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(booking => (
                <tr key={booking.id}>
                  <td>{booking.id}</td>
                  <td>{booking.user?.name || 'N/A'}</td>
                  <td>{booking.resource?.name || 'N/A'}</td>
                  <td>{booking.bookingDate}</td>
                  <td>{booking.timeSlot}</td>
                  <td>
                    <span className={`status-${booking.status?.toLowerCase()}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td>
                    {booking.status === 'PENDING' && (
                      <>
                        <button onClick={() => handleStatusUpdate(booking.id, 'APPROVED')}>✅ Approve</button>
                        <button onClick={() => handleStatusUpdate(booking.id, 'REJECTED')}>❌ Reject</button>
                      </>
                    )}
                    <button onClick={() => handleDelete(booking.id)}>🗑️ Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}