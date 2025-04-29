import { useNavigate, useLocation } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Function to check if a route is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-blue-600 tracking-tight">
                Cleaning Service
              </span>
            </div>
          </div>
          
          {/* Navigation buttons */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ease-in-out
                ${isActive('/dashboard') 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'}`}
            >
              Dashboard
            </button>
            
            <button
              onClick={() => navigate('/booking')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ease-in-out
                ${isActive('/booking') 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'}`}
            >
              New Booking
            </button>
            
            <button
              onClick={handleLogout}
              className="ml-2 px-4 py-2 rounded-md text-sm font-medium bg-red-500 text-white shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;