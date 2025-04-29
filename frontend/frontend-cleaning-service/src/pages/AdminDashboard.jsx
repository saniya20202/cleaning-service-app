import { useEffect, useState } from 'react';
import API from '../services/api';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState('');
  const navigate = useNavigate();

  const fetchAdminData = async () => {
    try {
      const bookingsRes = await API.get('/admin/bookings');
      const servicesRes = await API.get('/services');
      setBookings(bookingsRes.data);
      setServices(servicesRes.data);
    } catch (err) {
      console.error('Admin access required');
      navigate('/dashboard');
    }
  };

  const handleAddService = async () => {
    try {
      await API.post('/admin/services', { name: newService });
      setNewService('');
      fetchAdminData();
    } catch (err) {
      alert('Error adding service');
    }
  };

  const handleDeleteService = async (id) => {
    try {
      await API.delete(`/admin/services/${id}`);
      fetchAdminData();
    } catch (err) {
      alert('Failed to delete service');
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  return (
    <div className="p-6">
      <Navbar />
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">Manage Services</h2>
        <div className="flex gap-2 my-2">
          <input
            className="border px-3 py-1"
            value={newService}
            onChange={(e) => setNewService(e.target.value)}
            placeholder="New service name"
          />
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded"
            onClick={handleAddService}
          >
            Add
          </button>
        </div>
        <ul>
          {services.map((s) => (
            <li key={s._id} className="flex justify-between items-center border-b py-1">
              <span>{s.name}</span>
              <button
                onClick={() => handleDeleteService(s._id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">All Bookings</h2>
        <ul className="space-y-4">
          {bookings.map((booking) => (
            <li key={booking._id} className="bg-gray-100 p-4 rounded shadow">
              <p><strong>User:</strong> {booking.user_id?.username}</p>
              <p><strong>Name:</strong> {booking.customer_name}</p>
              <p><strong>Address:</strong> {booking.address}</p>
              <p><strong>Service:</strong> {booking.service_id?.name}</p>
              <p><strong>Date:</strong> {new Date(booking.date_time).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default AdminDashboard;
