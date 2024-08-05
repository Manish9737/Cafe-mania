import React from 'react';
import birthday from "../../images/BirthdayCelebration.jpeg";
import farewell from "../../images/FareWellParty.jpeg";
import meeting from "../../images/Meeting.jpg";
import bachellorsParty from "../../images/bachellorsParty.webp";
import danceParty from "../../images/danceParty.jpg";
import engagement from "../../images/engagement.jpg";
import anniversery from "../../images/anniversery.jpeg";
import "../../Assets/CSS/Gallery.css";

const Gallery = () => {
    return (
        <div className="gallery-container p-md-5 p-2">
            <div className="gallery-item">
                <img src={birthday} alt="Birthday Celebration" />
            </div>
            <div className="gallery-item">
                <img src={farewell} alt="Farewell Party" />
            </div>
            <div className="gallery-item">
                <img src={meeting} alt="Meeting" />
            </div>
            <div className="gallery-item">
                <img src={bachellorsParty} alt="Bachellors Party" />
            </div>
            <div className="gallery-item">
                <img src={danceParty} alt="Dance Party" />
            </div>
            <div className="gallery-item">
                <img src={engagement} alt="Engagement" />
            </div>
            <div className="gallery-item">
                <img src={anniversery} alt="Anniversary" />
            </div>
        </div>
    );
}

export default Gallery;
