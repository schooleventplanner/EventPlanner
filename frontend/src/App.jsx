import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Announcements from "./pages/Announcements";
import Dashboard from "./pages/Dashboard";
import StaffDashboard from "./pages/StaffDashboard";

import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route
          path="/events/:id"
          element={<EventDetail />}
        />
        <Route
          path="/announcements"
          element={<Announcements />}
        />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* PARTICIPANT */}
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        {/* STAFF */}
        <Route
          path="/admin"
          element={<StaffDashboard />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;