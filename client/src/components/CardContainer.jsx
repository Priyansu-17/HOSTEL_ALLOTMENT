import React from 'react';
import HostelCard from '../subComponent/HostelCard';
import amber from '../images/amber.jpg';
import aquamarine from '../images/aquamarine.jpg';
import diamond from '../images/diamond.jpg';
import emerald from '../images/emarald.jpg';
import jasper from '../images/jasper.jpg';
import intHostel from '../images/Int_hostel.jpg';
import opal from '../images/opal.jpg';
import rosaline from '../images/rosaline.jpg';
import sapphire from '../images/sapphire.jpg';
import topaz from '../images/topaz.jpg';

const CardContainer = () => {
  const hostels = [
    { imageSrc: amber, altText: 'Amber Hostel', title: 'Amber' },
    { imageSrc: aquamarine, altText: 'Aquamarine Hostel', title: 'Aquamarine' },
    { imageSrc: diamond, altText: 'Diamond Hostel', title: 'Diamond' },
    { imageSrc: emerald, altText: 'Emerald Hostel', title: 'Emerald' },
    { imageSrc: jasper, altText: 'Jasper Hostel', title: 'Jasper' },
    { imageSrc: intHostel, altText: 'Int Hostel', title: 'Int' },
    { imageSrc: opal, altText: 'Opal Hostel', title: 'Opal' },
    { imageSrc: rosaline, altText: 'Rosaline Hostel', title: 'Rosaline' },
    { imageSrc: sapphire, altText: 'Sapphire Hostel', title: 'Sapphire' },
    { imageSrc: topaz, altText: 'Topaz Hostel', title: 'Topaz' },
    { imageSrc: amber, altText: 'Amber Hostel', title: 'Amber' },
    { imageSrc: aquamarine, altText: 'Aquamarine Hostel', title: 'Aquamarine' },
    { imageSrc: diamond, altText: 'Diamond Hostel', title: 'Diamond' },
    { imageSrc: emerald, altText: 'Emerald Hostel', title: 'Emerald' },
    { imageSrc: jasper, altText: 'Jasper Hostel', title: 'Jasper' },
    { imageSrc: intHostel, altText: 'Int Hostel', title: 'Int' },
    { imageSrc: opal, altText: 'Opal Hostel', title: 'Opal' },
    { imageSrc: rosaline, altText: 'Rosaline Hostel', title: 'Rosaline' },
    { imageSrc: sapphire, altText: 'Sapphire Hostel', title: 'Sapphire' },
    { imageSrc: topaz, altText: 'Topaz Hostel', title: 'Topaz' },
    { imageSrc: amber, altText: 'Amber Hostel', title: 'Amber' },
    { imageSrc: aquamarine, altText: 'Aquamarine Hostel', title: 'Aquamarine' },
    { imageSrc: diamond, altText: 'Diamond Hostel', title: 'Diamond' },
    { imageSrc: emerald, altText: 'Emerald Hostel', title: 'Emerald' },
    { imageSrc: jasper, altText: 'Jasper Hostel', title: 'Jasper' },
    { imageSrc: intHostel, altText: 'Int Hostel', title: 'Int' },
    { imageSrc: opal, altText: 'Opal Hostel', title: 'Opal' },
    { imageSrc: rosaline, altText: 'Rosaline Hostel', title: 'Rosaline' },
    { imageSrc: sapphire, altText: 'Sapphire Hostel', title: 'Sapphire' },
    { imageSrc: topaz, altText: 'Topaz Hostel', title: 'Topaz' }
  ];

  return (
    <div className="image-grid">
      {hostels.map((hostel, index) => (
        <HostelCard key={index} {...hostel} />
      ))}
    </div>
  );
};

export default CardContainer;
