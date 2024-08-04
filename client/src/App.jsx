import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Navbar';
import UserHome from './pages/UserHome';
import Login from './pages/Login';
import Hostel from './pages/Hostel';
import AdminHome from './pages/AdminHome';

const LayoutWithHeader = ({ children }) => (
  <>
    <Header />
    <main>{children}</main>
  </>
);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/api/check-session', { credentials: 'include' })
      .then(response => response.json())
      .then(data => {
        setIsAuthenticated(data.isAuthenticated);
        setIsLoading(false); // Set loading to false after checking the session
      });
  }, []);

  if (isLoading) {
    return <p>Loading...</p>; // Or any loading indicator you prefer
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route
          path="/Hostel/:id"
          element={
            isAuthenticated ? <LayoutWithHeader><Hostel /></LayoutWithHeader> : <Navigate to="/login" />
          }
        />
        <Route
          path="/admin-home"
          element={
            isAuthenticated ? <LayoutWithHeader><AdminHome /></LayoutWithHeader> : <Navigate to="/login" />
          }
        />
        <Route
          path="/student-home"
          element={
            isAuthenticated ? <LayoutWithHeader><UserHome /></LayoutWithHeader> : <Navigate to="/login" />
          }
        />
        <Route path="/" element={<Navigate to={isAuthenticated ? "/student-home" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
