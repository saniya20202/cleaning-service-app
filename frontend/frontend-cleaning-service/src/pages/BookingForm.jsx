import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import API from '../services/api';
import Navbar from '../components/Navbar';

function BookingForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingId = new URLSearchParams(location.search).get('id');

  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [services, setServices] = useState([]);

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      const res = await API.get('/services');
      setServices(res.data);
    };

    const fetchBooking = async () => {
      if (bookingId) {
        const res = await API.get('/bookings');
        const booking = res.data.find((b) => b._id === bookingId);
        if (booking) {
          setCustomerName(booking.customer_name);
          setAddress(booking.address);
          setDateTime(booking.date_time.slice(0, 16));
          setServiceId(booking.service_id?._id || booking.service_id);
        }
      }
    };

    fetchServices();
    fetchBooking();
  }, [bookingId]);

  const validate = () => {
    const newErrors = {};
    if (!customerName.trim()) newErrors.customerName = 'Customer name is required.';
    else if (customerName.length < 3) newErrors.customerName = 'Minimum 3 characters.';

    if (!address.trim()) newErrors.address = 'Address is required.';
    else if (address.length < 5) newErrors.address = 'Minimum 5 characters.';

    if (!dateTime) newErrors.dateTime = 'Date & time required.';
    else if (new Date(dateTime) < new Date()) newErrors.dateTime = 'Must be a future date/time.';

    if (!serviceId) newErrors.serviceId = 'Please select a service.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (bookingId) {
        await API.put(`/bookings/${bookingId}`, {
          customer_name: customerName,
          address,
          date_time: dateTime,
          service_id: serviceId,
        });
      } else {
        await API.post('/bookings', {
          customer_name: customerName,
          address,
          date_time: dateTime,
          service_id: serviceId,
        });
      }

      setSuccess('Booking saved successfully!');
      setTimeout(() => navigate('/dashboard'), 1200);
    } catch (err) {
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex justify-center items-center min-h-screen bg-gray-800">
        <form
          onSubmit={handleSubmit}
          className="bg-blue-200 p-8 rounded-2xl shadow-md w-full max-w-2xl"
        >
          <h2 className="text-3xl font-bold mb-6 text-center">
            {bookingId ? 'Edit Booking' : 'New Booking'}
          </h2>

          {success && <div className="text-green-600 mb-4">{success}</div>}

          <div className="mb-4 font-semibold">
            <label className="block ">Customer Name</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
            {errors.customerName && (
              <p className="text-sm text-red-500">{errors.customerName}</p>
            )}
          </div>

          <div className="mb-4 font-semibold">
            <label className="block">Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
            {errors.address && (
              <p className="text-sm text-red-500">{errors.address}</p>
            )}
          </div>

          <div className="mb-4 font-semibold">
            <label className="block">Date & Time</label>
            <input
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
            {errors.dateTime && (
              <p className="text-sm text-red-500">{errors.dateTime}</p>
            )}
          </div>

          <div className="mb-6">
            <label className="block font-semibold">Service Type</label>
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="">Select a service</option>
              {services.map((service) => (
                <option key={service._id} value={service._id}>
                  {service.name}
                </option>
              ))}
            </select>
            {errors.serviceId && (
              <p className="text-sm text-red-500">{errors.serviceId}</p>
            )}
          </div>

          <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
            {bookingId ? 'Update Booking' : 'Create Booking'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default BookingForm;
