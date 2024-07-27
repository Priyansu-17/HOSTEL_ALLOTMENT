import React from 'react';

const HostelCard = ({ imageSrc, altText, title }) => {
  return (
    <div className="hostel-image">
      <img src={imageSrc} alt={altText} />
      <p>{title}</p>
    </div>
  );
};

export default HostelCard;
