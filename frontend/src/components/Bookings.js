import React, { useState, useEffect } from 'react';
import { bookingApi, userApi, resourceApi } from '../api/api';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [resources, setResources] = useState([]);
  const [newBooking, setNewBooking] = useState({
    userId: '',
    resourceId: '',
    bookingDate: '',
    timeSlot: '',
    status: 'PENDING',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [bookingsRes, usersRes, resourcesRes] = await Promise.all([
        bookingApi.getAll(),
        userApi.getAll(),
        resourceApi.getAll(),
      ]);
      setBookings(bookingsRes.data);
      setUsers(usersRes.data);
      setResources(resourcesRes.data);
    } catch (err) {
      setError('Failed to fetch data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBooking({ ...newBooking, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const bookingData = {
        bookingDate: newBooking.bookingDate,
        timeSlot: newBooking.timeSlot,
        status: newBooking.status,
      };
      await bookingApi.create(newBooking.userId, newBooking.resourceId, bookingData);
      setNewBooking({
        userId: '',
        resourceId: '',
        bookingDate: '',
        timeSlot: '',
        status: 'PENDING',
      });
      fetchData();
      setError('');
    } catch (err) {
      setError('Failed to create booking. The time slot may be already booked.');
      console.error(err);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await bookingApi.updateStatus(bookingId, newStatus);
      fetchData();
    } catch (err) {
      setError('Failed to update booking status');
      console.error(err);
    }
  };

  const timeSlots = [
    '09:00-10:00',
    '10:00-11:00',
    '11:00-12:00',
    '12:00-13:00',
    '13:00-14:00',
    '14:00-15:00',
    '15:00-16:00',
    '16:00-17:00',
    '17:00-18:00',
  ];

  return (
    <div className="section">
      <h2>Bookings</h2>
      
      <form onSubmit={handleSubmit} className="form">
        <h3>Create New Booking</h3>
        <div className="form-group">
          <label>User:</label>
          <select name="userId" value={newBooking.userId} onChange={handleInputChange} required>
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Resource:</label>
          <select name="resourceId" value={newBooking.resourceId} onChange={handleInputChange} required>
            <option value="">Select Resource</option>
            {resources.map((resource) => (
              <option key={resource.id} value={resource.id}>
                {resource.name} ({resource.type} - Capacity: {resource.capacity})
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Date:</label>
          <input
            type="date"
            name="bookingDate"
            value={newBooking.bookingDate}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Time Slot:</label>
          <select name="timeSlot" value={newBooking.timeSlot} onChange={handleInputChange} required>
            <option value="">Select Time Slot</option>
            {timeSlots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Create Booking</button>
      </form>

      {error && <div className="error">{error}</div>}
      
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Resource</th>
              <th>Date</th>
              <th>Time Slot</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.id}</td>
                <td>{booking.user?.name || 'N/A'}</td>
                <td>{booking.resource?.name || 'N/A'}</td>
                <td>{booking.bookingDate}</td>
                <td>{booking.timeSlot}</td>
                <td>
                  <span className={`status status-${booking.status?.toLowerCase()}`}>
                    {booking.status}
                  </span>
                </td>
                <td>
                  {booking.status === 'PENDING' && (
                    <>
                      <button
                        className="btn btn-small btn-success"
                        onClick={() => handleStatusChange(booking.id, 'APPROVED')}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-small btn-danger"
                        onClick={() => handleStatusChange(booking.id, 'REJECTED')}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Bookings;
