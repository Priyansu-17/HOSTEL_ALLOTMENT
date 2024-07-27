import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import UserHome from './pages/UserHome'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserHome />} />
        {/* <Route path="/hostel" element={<Hostel />} />
        <Route path="/admin" element={<AdminHome />} />  */}
        <Route path="/Login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;



