import React from "react";
import HostelCard from "../subComponent/HostelCard";

const CardContainer = () => {
    const hostels = ["amber", "diamond", "ruby", "amber", "diamond", "ruby"];
    return (
        <div className="cardContainer">
            {hostels.map((hostel, index) => (
                <HostelCard key={index} text={hostel} />
            ))}
        </div>
    );
};

export default CardContainer;
