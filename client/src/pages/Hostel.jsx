import React from 'react';
import { useParams } from 'react-router-dom';

const Hostel = () => {
  const {id}=useParams();
  return (
   <>
   <h1>Hello from Hostel {id}</h1>
   </>
  );
}

export default Hostel;
