import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Tasks from "./pages/Tasks";
import Inbox from "./pages/Inbox";
import Meetings from "./pages/Meetings";
import Calendar from "./pages/Calendar";

const App = () => {
  return (
    <Router>
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar />
        <div style={{ flex: 1, padding: "2rem", backgroundColor: "#f5f5f5" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/inbox" element={<Inbox />} />
            <Route path="/meetings" element={<Meetings />} />
            <Route path="/calendar" element={<Calendar />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
