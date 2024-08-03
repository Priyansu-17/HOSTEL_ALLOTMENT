import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Navbar';
import UserHome from './pages/UserHome';
import Login from './pages/Login';
import Hostel from './pages/Hostel';
import AdminHome from './pages/AdminHome'
const LayoutWithHeader = ({ children }) => (
  <>
    <Header />
    <main>{children}</main>
  </>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes with Header */}
        <Route path="/" element={<LayoutWithHeader><UserHome /></LayoutWithHeader>} />
        <Route path="/Hostel/:id" element={<LayoutWithHeader><Hostel /></LayoutWithHeader>} />
        <Route path="/admin" element={<LayoutWithHeader><AdminHome /></LayoutWithHeader>} />
        
        {/* Route without Header */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
