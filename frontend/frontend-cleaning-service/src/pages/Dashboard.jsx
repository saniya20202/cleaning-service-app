import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import Navbar from '../components/Navbar';

function Dashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await API.get('/bookings');
        setBookings(res.data);
      } catch (err) {
        if (err.response?.status === 401) {
          navigate('/');
        } else {
          setError('Failed to load bookings');
        }
      }
    };
    fetchBookings();
  }, [navigate]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await API.delete(`/bookings/${id}`);
        setBookings((prev) => prev.filter((b) => b._id !== id));
      } catch {
        alert('Failed to delete booking');
      }
    }
  };

  return (
    <div className="p-6">
      <Navbar />
      <h1 className="text-2xl font-bold mb-4">My Bookings</h1>
      {error && <div className="text-red-500">{error}</div>}
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <ul className="space-y-4">
          {bookings.map((booking) => (
            <li key={booking._id} className="bg-white p-4 rounded shadow relative">
              <p><strong>Name:</strong> {booking.customer_name}</p>
              <p><strong>Address:</strong> {booking.address}</p>
              <p><strong>Date:</strong> {new Date(booking.date_time).toLocaleString()}</p>
              <p><strong>Service:</strong> {booking.service_id?.name || 'N/A'}</p>

              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  className="text-blue-500 hover:underline"
                  onClick={() => navigate(`/booking?id=${booking._id}`)}
                >
                  Edit
                </button>
                <button
                  className="text-red-500 hover:underline"
                  onClick={() => handleDelete(booking._id)}
                >
                  Cancel
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;
