import React from "react";
import {
  Search,
  Bell,
  Car,
  Bike,
  Truck,
  MoreHorizontal,
  MapPin,
  UserCircle,
} from "lucide-react"; // Removed Motorcycle, Bike is used for both two-wheelers

// Main App component
const App = () => {
  return (
    <div className="min-h-screen bg-blue-600 flex flex-col font-inter">
      {/* Header Section */}
      <header className="p-6 flex items-center justify-between text-white">
        <div className="flex items-center space-x-3">
          {/* User Profile Placeholder */}
          <UserCircle className="w-10 h-10 rounded-full text-white border-2 border-white" />
          {/* Greeting */}
          <span className="text-lg font-medium">GOOD MORNING</span>
        </div>
        {/* Notification Bell Icon */}
        <div className="bg-blue-700 p-2 rounded-full shadow-lg">
          <Bell className="w-5 h-5" />
        </div>
      </header>

      {/* Main Title Section */}
      <section className="px-6 py-8 text-white text-center">
        <h1 className="text-3xl font-bold leading-tight">
          Find the best place to park
        </h1>
      </section>

      {/* Search Bar Section */}
      <section className="px-6 mt-4">
        <div className="relative flex items-center bg-white rounded-xl shadow-lg p-3">
          <Search className="w-5 h-5 text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search"
            className="flex-grow text-gray-700 placeholder-gray-400 focus:outline-none"
          />
        </div>
      </section>

      {/* Vehicle Type Section */}
      <section className="px-6 mt-8">
        <div className="flex justify-around bg-white p-4 rounded-2xl shadow-lg">
          {/* Vehicle Type Item: Car */}
          <div className="flex flex-col items-center">
            <div className="bg-blue-600 p-3 rounded-full mb-2 shadow-md">
              <Car className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm text-gray-700 font-medium">Car</span>
          </div>
          {/* Vehicle Type Item: Bike */}
          <div className="flex flex-col items-center">
            <div className="bg-gray-100 p-3 rounded-full mb-2">
              <Bike className="w-6 h-6 text-gray-500" />
            </div>
            <span className="text-sm text-gray-700 font-medium">Bike</span>
          </div>
          {/* Vehicle Type Item: Van (now Truck icon) */}
          <div className="flex flex-col items-center">
            <div className="bg-gray-100 p-3 rounded-full mb-2">
              <Truck className="w-6 h-6 text-gray-500" />
            </div>
            <span className="text-sm text-gray-700 font-medium">Van</span>
          </div>
          {/* Vehicle Type Item: Scooter (now using Bike icon) */}
          <div className="flex flex-col items-center">
            <div className="bg-gray-100 p-3 rounded-full mb-2">
              <Bike className="w-6 h-6 text-gray-500" />{" "}
              {/* Changed to Bike icon */}
            </div>
            <span className="text-sm text-gray-700 font-medium">Scooter</span>
          </div>
          {/* Vehicle Type Item: More */}
          <div className="flex flex-col items-center">
            <div className="bg-gray-100 p-3 rounded-full mb-2">
              <MoreHorizontal className="w-6 h-6 text-gray-500" />
            </div>
            <span className="text-sm text-gray-700 font-medium">More</span>
          </div>
        </div>
      </section>

      {/* Parking Nearby Section */}
      <section className="flex-grow bg-gray-50 rounded-t-3xl mt-8 p-6 shadow-inner overflow-y-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Parking Nearby</h2>
        <div className="space-y-4">
          {/* Parking Item 1: Ambience Mall */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden flex items-center p-4">
            <div className="w-24 h-24 bg-blue-200 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
              <MapPin className="w-12 h-12 text-blue-700" />
            </div>
            <div className="flex-grow">
              <h3 className="text-lg font-semibold text-gray-800">
                ambience mall
              </h3>
              <div className="flex items-center text-gray-500 text-sm mt-1">
                <MapPin className="w-4 h-4 mr-1" />
                <span>secto 52</span>
              </div>
              <p className="text-blue-600 font-bold text-lg mt-2">
                100 rupees/
              </p>
            </div>
          </div>

          {/* Parking Item 2: New Delhi Airport */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden flex items-center p-4">
            <div className="w-24 h-24 bg-red-200 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
              <MapPin className="w-12 h-12 text-red-700" />
            </div>
            <div className="flex-grow">
              <h3 className="text-lg font-semibold text-gray-800">
                new delhi airport
              </h3>
              <div className="flex items-center text-gray-500 text-sm mt-1">
                <MapPin className="w-4 h-4 mr-1" />
                <span>airport parking</span>
              </div>
              <p className="text-blue-600 font-bold text-lg mt-2">150/</p>
            </div>
          </div>

          {/* Parking Item 3: Anant Vihar Station */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden flex items-center p-4">
            <div className="w-24 h-24 bg-green-200 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
              <MapPin className="w-12 h-12 text-green-700" />
            </div>
            <div className="flex-grow">
              <h3 className="text-lg font-semibold text-gray-800">
                ananat vihar station
              </h3>
              <div className="flex items-center text-gray-500 text-sm mt-1">
                <MapPin className="w-4 h-4 mr-1" />
                <span>delhi metro</span>
              </div>
              <p className="text-blue-600 font-bold text-lg mt-2">85/</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Navigation */}
      <nav className="bg-white p-4 flex justify-around items-center rounded-t-2xl shadow-lg border-t border-gray-100">
        <div className="flex flex-col items-center text-blue-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-home"
          >
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </div>
        <div className="flex flex-col items-center text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-map"
          >
            <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21 3 6" />
            <line x1="9" x2="9" y1="3" y2="18" />
            <line x1="15" x2="15" y1="6" y2="21" />
          </svg>
        </div>
        <div className="flex flex-col items-center text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-user"
          >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
      </nav>
    </div>
  );
};

export default App;
