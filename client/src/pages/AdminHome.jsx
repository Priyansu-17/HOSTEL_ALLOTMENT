import React, { useState } from 'react';
import TableContainer from '../components/TableContainer.jsx';
import EditContainer from '../components/EditContainer.jsx';
import SwapContainer from '../components/SwapContainer.jsx';
import AllotedContainer from '../components/AllotedContainer.jsx';
const AdminHome = () => {
  const [activeComponent, setActiveComponent] = useState('table');
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <>
      {/* Hamburger menu for small screens */}
      <div className='hamburger-menu' onClick={toggleSidebar}>
        ☰
      </div>
      {/* Sidebar with conditional class for toggling */}
      <div className={`admin-sidebar ${isSidebarOpen ? 'sidebar-active' : ''}`}>
        <button className={activeComponent === 'table' ? 'active' : ''} onClick={() => setActiveComponent('table')}>Table</button>
        <button className={activeComponent === 'edit' ? 'active' : ''} onClick={() => setActiveComponent('edit')}>Edit</button>
        <button className={activeComponent === 'swap' ? 'active' : ''} onClick={() => setActiveComponent('swap')}>Swap</button>
        <button className={activeComponent === 'download' ? 'active' : ''} onClick={() => setActiveComponent('download')}>Alloted List</button>
      </div>
      <div className='admin'>
        {activeComponent === 'table' && <TableContainer />}
        {activeComponent === 'edit' && <EditContainer />}
        {activeComponent === 'swap' && <SwapContainer />}
        {activeComponent === 'download' && <AllotedContainer />}
      </div>
    </>
  );
}

export default AdminHome;
