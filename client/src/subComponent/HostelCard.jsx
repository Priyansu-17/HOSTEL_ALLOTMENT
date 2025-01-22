import React from 'react';

function handleClick(title){
  window.location.href=`/Hostel/${title}`
}
const HostelCard = ({ imageSrc, altText, title }) => {
  
  return (
    <div className="hostel-image" onClick={()=>{handleClick(title)}}>
      <img src={imageSrc} alt={altText} />
      <p>{title}</p>
    </div>
  );
};



export default HostelCard;
