import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Navbar';
import UserHome from './pages/UserHome';
import styles from './index.css';

function App() {
  return (
    <body>
      <Header />
      <main>
        <Router>
          <Routes>
            <Route path="/" element={<UserHome />} />
            {/* <Route path="/hostel" element={<Hostel />} />
            <Route path="/admin" element={<AdminHome />} /> 
            <Route path="/Login" element={<Login />} /> */}
          </Routes>
        </Router>
      </main>
    </body>
  );
}

export default App;
