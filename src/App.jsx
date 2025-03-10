// App.jsx
import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import SleepClockWithClock from "./pages/SleepClockWithClock"; // Import the new component

const App = () => {
  return (
    <div>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/sleep-clock">Sleep Clock</Link></li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sleep-clock" element={<SleepClockWithClock />} /> {/* Use SleepClockWithClock */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;