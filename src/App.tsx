import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";

// Tailwind CSS is assumed to be available
// Mocked UI Components for clarity and to simulate shadcn/ui where applicable
const Card = ({ children, className }) => (
  <div className={`bg-white p-4 rounded-lg shadow-md ${className}`}>
    {children}
  </div>
);
const Button = ({
  children,
  onClick,
  disabled,
  className,
  variant = "primary",
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 rounded-md font-semibold transition-colors duration-200
      ${variant === "primary" ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}
      ${
        variant === "secondary"
          ? "bg-gray-200 hover:bg-gray-300 text-gray-800"
          : ""
      }
      ${variant === "danger" ? "bg-red-600 hover:bg-red-700 text-white" : ""}
      ${disabled ? "bg-gray-300 text-gray-500 cursor-not-allowed" : ""}
      ${className}`}
  >
    {children}
  </button>
);
const Input = ({ type = "text", placeholder, value, onChange, className }) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={`w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 ${className}`}
  />
);
const Dialog = ({ children, isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full relative p-6">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-lg"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

// --- Icons (using inline SVG for simplicity) ---
const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5 text-gray-400"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
    />
  </svg>
);
const LocationPinIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-4 h-4 mr-1"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
    />
  </svg>
);
const ParkingIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 24 24"
    className={`w-6 h-6 ${className}`}
  >
    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-10c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm11 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM7 10l-.77-2.22C6.09 7.22 6.54 7 7 7h10c.46 0 .91.22.99.78L17 10H7z" />
  </svg>
);

// --- Context ---
const ParkingContext = createContext();

const ParkingProvider = ({ children }) => {
  const initialParkingSpots = [
    {
      id: "P001",
      name: "City Center Parking",
      address: "123 Main St, Anytown",
      rate: 25,
      initialAvailability: 8,
      totalSlots: 10,
    },
    {
      id: "P002",
      name: "Mall Parking Garage",
      address: "456 Mall Ave, Anytown",
      rate: 30,
      initialAvailability: 2,
      totalSlots: 5,
    },
    {
      id: "P003",
      name: "Airport Parking",
      address: "789 Airport Blvd, Anytown",
      rate: 50,
      initialAvailability: 15,
      totalSlots: 20,
    },
    {
      id: "P004",
      name: "University Campus Lot",
      address: "101 College Dr, Anytown",
      rate: 15,
      initialAvailability: 0,
      totalSlots: 3,
    },
    {
      id: "P005",
      name: "Downtown Street Parking",
      address: "321 Oak St, Anytown",
      rate: 20,
      initialAvailability: 5,
      totalSlots: 5,
    },
    {
      id: "P006",
      name: "Riverside Community Park",
      address: "987 River Rd, Anytown",
      rate: 10,
      initialAvailability: 3,
      totalSlots: 3,
    },
  ];

  const [parkingSpots, setParkingSpots] = useState(() => {
    // Load from localStorage or use initial data
    try {
      const storedSpots = localStorage.getItem("spmosParkingSpots");
      if (storedSpots) {
        // Ensure initialAvailability is used for totalSlots if not explicitly set
        return JSON.parse(storedSpots).map((spot) => ({
          ...spot,
          totalSlots: spot.totalSlots || spot.initialAvailability, // Fallback
        }));
      }
    } catch (e) {
      console.error("Failed to parse parking spots from localStorage", e);
    }
    return initialParkingSpots;
  });
  const [filters, setFilters] = useState({
    searchTerm: "",
    availability: "any",
    priceRange: [0, 100],
  });
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [currentSession, setCurrentSession] = useState(() => {
    try {
      const storedSession = localStorage.getItem("spmosParkingSession");
      return storedSession ? JSON.parse(storedSession) : null;
    } catch (e) {
      console.error("Failed to parse parking session from localStorage", e);
      return null;
    }
  });
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("spmosUser");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
      return null;
    }
  });

  // Save parking spots and session to localStorage on change
  useEffect(() => {
    localStorage.setItem("spmosParkingSpots", JSON.stringify(parkingSpots));
  }, [parkingSpots]);

  useEffect(() => {
    localStorage.setItem("spmosParkingSession", JSON.stringify(currentSession));
  }, [currentSession]);

  useEffect(() => {
    localStorage.setItem("spmosUser", JSON.stringify(user));
  }, [user]);

  // Simulate real-time availability updates
  useEffect(() => {
    const interval = setInterval(() => {
      setParkingSpots((prevSpots) =>
        prevSpots.map((spot) => {
          if (!spot.isBooked) {
            // Only change availability for unbooked spots
            const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
            const newAvailability = Math.max(
              0,
              Math.min(spot.totalSlots, spot.availableSlots + change)
            );
            return { ...spot, availableSlots: newAvailability };
          }
          return spot;
        })
      );
    }, 8000); // Update every 8 seconds

    return () => clearInterval(interval);
  }, []);

  const updateParkingSpot = useCallback((id, updates) => {
    setParkingSpots((prevSpots) =>
      prevSpots.map((spot) => (spot.id === id ? { ...spot, ...updates } : spot))
    );
  }, []);

  const bookSpot = useCallback(
    (spotId, duration = 1) => {
      const spot = parkingSpots.find((s) => s.id === spotId);
      if (spot && spot.availableSlots > 0 && !spot.isBooked) {
        updateParkingSpot(spotId, {
          availableSlots: spot.availableSlots - 1,
          isBooked: true,
        });
        const newSession = {
          spotId: spot.id,
          spotName: spot.name,
          spotAddress: spot.address,
          rate: spot.rate,
          bookingTime: new Date().toISOString(),
          estimatedDuration: duration,
          status: "active", // Immediately active for simulation
          startTime: new Date().toISOString(), // Session starts now
          sessionId: `SESS-${Date.now()}`,
        };
        setCurrentSession(newSession);
        setSelectedSpot(null); // Close modal
        return true;
      }
      return false;
    },
    [parkingSpots, updateParkingSpot]
  );

  const endSession = useCallback(() => {
    if (currentSession && currentSession.status === "active") {
      const endTime = new Date().toISOString();
      const sessionStart = new Date(currentSession.startTime);
      const sessionEnd = new Date(endTime);
      const actualDurationMs = sessionEnd.getTime() - sessionStart.getTime();
      const actualDurationHours = Math.ceil(
        actualDurationMs / (1000 * 60 * 60)
      ); // Round up to nearest hour
      const totalCost = actualDurationHours * currentSession.rate;

      setCurrentSession((prev) => ({
        ...prev,
        status: "completed",
        endTime: endTime,
        actualDurationHours: actualDurationHours,
        totalCost: totalCost,
      }));
      // Make the spot available again
      const currentSpot = parkingSpots.find(
        (s) => s.id === currentSession.spotId
      );
      if (currentSpot) {
        updateParkingSpot(currentSession.spotId, {
          availableSlots: currentSpot.availableSlots + 1,
          isBooked: false,
        });
      }
    }
  }, [currentSession, parkingSpots, updateParkingSpot]);

  const clearSession = useCallback(() => {
    setCurrentSession(null);
  }, []);

  const login = useCallback((username) => {
    setUser({ username });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setCurrentSession(null);
    localStorage.removeItem("spmosUser");
    localStorage.removeItem("spmosParkingSession");
  }, []);

  const filteredParkingSpots = parkingSpots.filter((spot) => {
    const matchesSearch =
      spot.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      spot.address.toLowerCase().includes(filters.searchTerm.toLowerCase());
    const matchesAvailability =
      filters.availability === "any" ||
      (filters.availability === "available" && spot.availableSlots > 0) ||
      (filters.availability === "occupied" && spot.availableSlots === 0);
    const matchesPrice =
      spot.rate >= filters.priceRange[0] && spot.rate <= filters.priceRange[1];
    return matchesSearch && matchesAvailability && matchesPrice;
  });

  return (
    <ParkingContext.Provider
      value={{
        parkingSpots: filteredParkingSpots,
        filters,
        setFilters,
        selectedSpot,
        setSelectedSpot,
        currentSession,
        bookSpot,
        endSession,
        clearSession,
        user,
        login,
        logout,
      }}
    >
      {children}
    </ParkingContext.Provider>
  );
};

// --- Components ---

const WelcomeScreen = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-4 text-center">
      <ParkingIcon className="w-24 h-24 mb-6 text-white" />
      <h1 className="text-4xl font-bold mb-4">Welcome to SPMOS</h1>
      <p className="text-lg mb-8">Your Smart Parking Optimization System</p>
      <Button
        onClick={onGetStarted}
        className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-xl rounded-full shadow-lg"
      >
        Get Started
      </Button>
    </div>
  );
};

const AuthScreen = ({ onLoginSuccess }) => {
  const { login } = useContext(ParkingContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (username && password) {
      login(username);
      onLoginSuccess();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Login to SPMOS
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username
            </label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full py-2.5 mt-4">
            Login / Signup
          </Button>
        </form>
      </Card>
    </div>
  );
};

const SearchBar = () => {
  const { filters, setFilters, user, logout } = useContext(ParkingContext);
  const [tempSearchTerm, setTempSearchTerm] = useState(filters.searchTerm);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setFilters((prev) => ({ ...prev, searchTerm: tempSearchTerm }));
    }, 300); // Debounce search input
    return () => clearTimeout(handler);
  }, [tempSearchTerm, setFilters]);

  // Ensure priceRange is valid if initial load has issues
  useEffect(() => {
    if (filters.priceRange[0] > filters.priceRange[1]) {
      setFilters((prev) => ({
        ...prev,
        priceRange: [prev.priceRange[1], prev.priceRange[1]],
      }));
    }
  }, [filters.priceRange, setFilters]);

  return (
    <div className="bg-white p-4 pb-6 rounded-b-xl shadow-md sticky top-0 z-10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {/* User Avatar Placeholder */}
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
            {user ? user.username.charAt(0).toUpperCase() : "?"}
          </div>
          <div>
            <p className="text-xs text-gray-500">Welcome,</p>
            <p className="font-semibold text-gray-800">
              {user ? user.username : "Guest"}
            </p>
          </div>
        </div>
        <Button
          onClick={logout}
          variant="secondary"
          className="px-3 py-1 text-sm"
        >
          Logout
        </Button>
      </div>

      <div className="relative mb-3">
        <Input
          type="text"
          placeholder="Search for address or keyword..."
          value={tempSearchTerm}
          onChange={(e) => setTempSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-3 rounded-full border border-gray-200 focus:border-blue-500 bg-gray-50 text-gray-700"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2">
          <SearchIcon />
        </span>
      </div>
      <div className="flex justify-between items-center text-sm text-gray-600">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-1 p-2 rounded-md hover:bg-gray-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591L124 12.449a.75.75 0 00-.22.518v.62c0 1.093-.561 2.027-1.327 2.571l-3.003 2.002a.75.75 0 01-1.232-.693v-1.258a3.731 3.731 0 00-.658-.496L3.717 8.216a.75.75 0 01-.004-.855L7.172 4.09A9.006 9.006 0 0112 3z"
            />
          </svg>
          <span>Filters</span>
        </button>
      </div>

      {showFilters && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
          <div>
            <label
              htmlFor="availability-filter"
              className="block text-sm font-medium text-gray-700"
            >
              Availability:
            </label>
            <select
              id="availability-filter"
              value={filters.availability}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  availability: e.target.value,
                }))
              }
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="any">Any</option>
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="min-price-filter"
              className="block text-sm font-medium text-gray-700"
            >
              Min Price (₹): {filters.priceRange[0]}
            </label>
            <input
              type="range"
              id="min-price-filter"
              min="0"
              max="100"
              value={filters.priceRange[0]}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  priceRange: [
                    parseInt(e.target.value),
                    Math.max(parseInt(e.target.value), prev.priceRange[1]),
                  ],
                }))
              }
              className="mt-1 w-full"
            />
          </div>
          <div>
            <label
              htmlFor="max-price-filter"
              className="block text-sm font-medium text-gray-700"
            >
              Max Price (₹): {filters.priceRange[1]}
            </label>
            <input
              type="range"
              id="max-price-filter"
              min="0"
              max="100"
              value={filters.priceRange[1]}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  priceRange: [
                    Math.min(parseInt(e.target.value), prev.priceRange[0]),
                    parseInt(e.target.value),
                  ],
                }))
              }
              className="mt-1 w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
};

const ParkingCard = ({ spot }) => {
  const { setSelectedSpot } = useContext(ParkingContext);
  const isAvailable = spot.availableSlots > 0;

  return (
    <Card
      className="flex flex-col md:flex-row items-center cursor-pointer hover:shadow-lg transition-shadow p-4 border border-gray-100"
      onClick={() => setSelectedSpot(spot)}
    >
      <div className="w-full md:w-1/3 flex-shrink-0 mb-4 md:mb-0 md:mr-4">
        <div className="w-full h-32 bg-gray-200 rounded-md flex items-center justify-center text-gray-500 text-sm overflow-hidden">
          <img
            src={`https://placehold.co/128x128/D1E7DD/0F5132?text=${
              spot.name.split(" ")[0]
            }`}
            alt={spot.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://placehold.co/128x128/D1E7DD/0F5132?text=Park`;
            }}
          />
        </div>
      </div>
      <div className="flex-grow w-full md:w-2/3">
        <h3 className="text-lg font-semibold text-gray-800">{spot.name}</h3>
        <p className="text-sm text-gray-600 flex items-center mb-2">
          <LocationPinIcon /> {spot.address}
        </p>
        <div className="flex items-center justify-between text-sm">
          <div>
            <span
              className={`font-bold ${
                isAvailable ? "text-green-600" : "text-red-600"
              }`}
            >
              {isAvailable ? `${spot.availableSlots} available` : "Occupied"}
            </span>
            <span className="text-gray-500 ml-1">
              of {spot.totalSlots} slots
            </span>
          </div>
          <p className="font-bold text-lg text-blue-600">
            ₹{spot.rate}
            <span className="text-sm text-gray-500">/hr</span>
          </p>
        </div>
      </div>
    </Card>
  );
};

const ParkingList = () => {
  const { parkingSpots } = useContext(ParkingContext);

  return (
    <div className="p-4 grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {parkingSpots.length > 0 ? (
        parkingSpots.map((spot) => <ParkingCard key={spot.id} spot={spot} />)
      ) : (
        <p className="col-span-full text-center text-gray-600">
          No parking spots found matching your criteria.
        </p>
      )}
    </div>
  );
};

const BookingModal = ({ isOpen, onClose }) => {
  const { selectedSpot, bookSpot, currentSession } = useContext(ParkingContext);
  const [duration, setDuration] = useState(1);
  const [showNavigationMessage, setShowNavigationMessage] = useState(false);

  useEffect(() => {
    if (isOpen && selectedSpot) {
      setDuration(1); // Reset duration when modal opens
      setShowNavigationMessage(false);
    }
  }, [isOpen, selectedSpot]);

  if (!selectedSpot) return null;

  const handleBook = () => {
    if (bookSpot(selectedSpot.id, duration)) {
      onClose(); // Close the modal
    } else {
      // Replaced alert with a custom message box for better UX
      const confirmDialog = document.createElement("div");
      confirmDialog.innerHTML = `
        <div style="position: fixed; inset: 0; background-color: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
          <div style="background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center;">
            <p style="margin-bottom: 15px; font-weight: bold;">Failed to book spot. It might be occupied now.</p>
            <button id="close-dialog-btn" style="background-color: #3B82F6; color: white; padding: 8px 15px; border-radius: 5px; border: none; cursor: pointer;">OK</button>
          </div>
        </div>
      `;
      document.body.appendChild(confirmDialog);
      document.getElementById("close-dialog-btn").onclick = () => {
        document.body.removeChild(confirmDialog);
      };
    }
  };

  const handleNavigate = () => {
    setShowNavigationMessage(true);
    setTimeout(() => setShowNavigationMessage(false), 3000); // Hide message after 3 seconds
  };

  const isBooked = currentSession && currentSession.spotId === selectedSpot.id;

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Parking Details</h2>
      <div className="space-y-3 mb-6">
        <p className="text-xl font-semibold">{selectedSpot.name}</p>
        <p className="text-gray-600 flex items-center">
          <LocationPinIcon /> {selectedSpot.address}
        </p>
        <p className="text-lg">
          Rate:{" "}
          <span className="font-bold text-blue-600">₹{selectedSpot.rate}</span>{" "}
          / hour
        </p>
        <p className="text-md">
          Availability:{" "}
          <span
            className={`font-semibold ${
              selectedSpot.availableSlots > 0
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {selectedSpot.availableSlots > 0
              ? `${selectedSpot.availableSlots} slots available`
              : "Fully Occupied"}
          </span>
        </p>
      </div>

      {!isBooked ? (
        <div className="mb-6">
          <label
            htmlFor="duration"
            className="block text-md font-medium text-gray-700 mb-2"
          >
            Booking Duration (hours):
          </label>
          <Input
            id="duration"
            type="number"
            min="1"
            value={duration}
            onChange={(e) =>
              setDuration(Math.max(1, parseInt(e.target.value) || 1))
            }
            className="w-full text-center text-lg"
          />
        </div>
      ) : (
        <p className="text-green-600 font-semibold mb-4">
          This spot is currently booked by you!
        </p>
      )}

      <div className="flex flex-col space-y-3">
        <Button
          onClick={handleBook}
          disabled={!selectedSpot.availableSlots > 0 || isBooked}
          className="w-full"
        >
          {isBooked ? "Spot Booked" : "Book Now"}
        </Button>
        {isBooked && (
          <Button
            onClick={handleNavigate}
            variant="secondary"
            className="w-full"
          >
            Navigate
          </Button>
        )}
        {showNavigationMessage && (
          <p className="text-blue-600 text-sm text-center mt-2">
            Navigation simulated!
          </p>
        )}
        <Button onClick={onClose} variant="secondary" className="w-full">
          Close
        </Button>
      </div>
    </Dialog>
  );
};

const SessionTracker = () => {
  const { currentSession, endSession, clearSession } =
    useContext(ParkingContext);
  const [elapsedTime, setElapsedTime] = useState(0); // in seconds
  const timerRef = useRef(null);

  useEffect(() => {
    if (currentSession && currentSession.status === "active") {
      const start = new Date(currentSession.startTime).getTime();
      timerRef.current = setInterval(() => {
        setElapsedTime(Math.floor((new Date().getTime() - start) / 1000));
      }, 1000);
    } else {
      clearInterval(timerRef.current);
      setElapsedTime(0);
    }
    return () => clearInterval(timerRef.current);
  }, [currentSession]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  if (!currentSession || currentSession.status !== "active") return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-blue-700 text-white p-4 shadow-lg z-20">
      <div className="max-w-md mx-auto flex justify-between items-center">
        <div>
          <p className="text-sm">Parking at {currentSession.spotName}</p>
          <p className="text-xl font-bold">
            Elapsed: {formatTime(elapsedTime)}
          </p>
        </div>
        <Button
          onClick={endSession}
          variant="danger"
          className="bg-red-500 hover:bg-red-600"
        >
          End Session
        </Button>
      </div>
    </div>
  );
};

const SummaryModal = ({ isOpen, onClose }) => {
  const { currentSession, clearSession } = useContext(ParkingContext);

  const handleClose = () => {
    clearSession(); // Clear session data
    onClose();
  };

  if (!currentSession || currentSession.status !== "completed") return null;

  return (
    <Dialog isOpen={isOpen} onClose={handleClose}>
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Session Summary</h2>
      <div className="space-y-3 mb-6">
        <p>
          <strong>Parking Spot:</strong> {currentSession.spotName}
        </p>
        <p>
          <strong>Address:</strong> {currentSession.spotAddress}
        </p>
        <p>
          <strong>Rate:</strong> ₹{currentSession.rate} / hour
        </p>
        <p>
          <strong>Actual Duration:</strong> {currentSession.actualDurationHours}{" "}
          hours
        </p>
        <p className="text-xl font-bold text-green-700">
          Total Cost: ₹{currentSession.totalCost}
        </p>
      </div>
      <Button onClick={handleClose} className="w-full">
        Start New Search
      </Button>
    </Dialog>
  );
};

// --- Main App Component ---
const App = () => {
  const { selectedSpot, setSelectedSpot, currentSession, user } =
    useContext(ParkingContext);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [appView, setAppView] = useState("welcome"); // 'welcome', 'auth', 'main_app'

  // Determine initial view based on user session
  useEffect(() => {
    if (user) {
      setAppView("main_app");
    } else {
      setAppView("welcome");
    }
  }, [user]);

  // Control modal visibility based on context state
  useEffect(() => {
    if (selectedSpot) {
      setIsBookingModalOpen(true);
    } else {
      setIsBookingModalOpen(false);
    }
  }, [selectedSpot]);

  useEffect(() => {
    if (currentSession && currentSession.status === "completed") {
      setIsSummaryModalOpen(true);
    } else {
      setIsSummaryModalOpen(false);
    }
  }, [currentSession]);

  const handleCloseBookingModal = () => {
    setSelectedSpot(null); // Clear selected spot in context
    setIsBookingModalOpen(false);
  };

  const handleCloseSummaryModal = () => {
    setIsSummaryModalOpen(false);
  };

  const handleGetStarted = () => {
    setAppView("auth");
  };

  const handleLoginSuccess = () => {
    setAppView("main_app");
  };

  const renderAppContent = () => {
    switch (appView) {
      case "welcome":
        return <WelcomeScreen onGetStarted={handleGetStarted} />;
      case "auth":
        return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
      case "main_app":
        return (
          <>
            <SearchBar />
            <ParkingList />
            {/* Modals */}
            <BookingModal
              isOpen={isBookingModalOpen}
              onClose={handleCloseBookingModal}
            />
            <SummaryModal
              isOpen={isSummaryModalOpen}
              onClose={handleCloseSummaryModal}
            />
            {/* Session Tracker persistent UI */}
            <SessionTracker />
          </>
        );
      default:
        return <WelcomeScreen onGetStarted={handleGetStarted} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans antialiased text-gray-900">
      {renderAppContent()}
    </div>
  );
};

const Root = () => (
  <ParkingProvider>
    <App />
  </ParkingProvider>
);

export default Root;
