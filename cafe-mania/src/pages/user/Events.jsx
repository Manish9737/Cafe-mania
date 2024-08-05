import React, { useState } from 'react';
import birthday from "../../images/BirthdayCelebration.jpeg";
import farewell from "../../images/FareWellParty.jpeg";
import meeting from "../../images/Meeting.jpg";
import bachellorsParty from "../../images/bachellorsParty.webp";
import danceParty from "../../images/danceParty.jpg";
import engagement from "../../images/engagement.jpg";
import anniversery from "../../images/anniversery.jpeg";
import "../../Assets/CSS/Events.css";
import { FaCalendarAlt } from 'react-icons/fa';

const eventsData = [
  {
    title: "Birthday Celebration",
    date: "July 25, 2023",
    image: birthday,
    description: "We had a wonderful time celebrating birthdays with cake, music, and games. It was a joyful day filled with laughter and fun, as everyone gathered to celebrate. The decorations were vibrant, and the atmosphere was lively. Friends and family came together to make the day special for the birthday celebrants. The highlight of the day was the heartfelt speeches and the delicious birthday cake."
  },
  {
    title: "Farewell Party",
    date: "June 10, 2023",
    image: farewell,
    description: "A heartfelt farewell party to bid goodbye to our beloved colleagues. It was a bittersweet occasion filled with memories and emotions. The evening was marked by touching speeches, farewell gifts, and shared stories of the times spent together. We celebrated their contributions and wished them the best for their future endeavors. The event ended with a warm send-off, leaving everyone with a sense of nostalgia and gratitude."
  },
  {
    title: "Team Meeting",
    date: "August 15, 2023",
    image: meeting,
    description: "An important team meeting to discuss upcoming projects and strategies. The session was interactive and productive, with everyone actively participating. Key points and objectives were outlined, and new ideas were brainstormed. The meeting fostered a sense of teamwork and collaboration, setting the tone for future success. We left the meeting feeling motivated and ready to tackle the challenges ahead."
  },
  {
    title: "Bachelors Party",
    date: "September 12, 2023",
    image: bachellorsParty,
    description: "A fun-filled bachelor's party to celebrate the groom-to-be. The night was full of excitement, laughter, and unforgettable moments. Friends gathered to create lasting memories and enjoy various activities planned for the evening. The event was a perfect mix of relaxation and exhilaration, providing a wonderful send-off for the groom as he embarked on a new chapter in life."
  },
  {
    title: "Dance Party",
    date: "October 5, 2023",
    image: danceParty,
    description: "An electrifying dance party that got everyone moving to the beat. The night was alive with music, lights, and energy. Attendees showcased their dance moves, creating an atmosphere of joy and celebration. The DJ kept the music pumping, and the dance floor was packed all night long. It was a memorable evening where everyone let loose and enjoyed the vibrant party vibes."
  },
  {
    title: "Engagement Ceremony",
    date: "November 20, 2023",
    image: engagement,
    description: "A beautiful engagement ceremony celebrating the love and commitment of the couple. The venue was elegantly decorated, setting a romantic ambiance. Family and friends gathered to witness the couple exchange rings and celebrate their union. The event was filled with heartfelt moments, speeches, and joyous celebrations. It marked the beginning of a new journey for the couple, surrounded by the love and support of their loved ones."
  },
  {
    title: "Anniversary Celebration",
    date: "December 10, 2023",
    image: anniversery,
    description: "A joyous anniversary celebration marking another year of love and togetherness. The event was filled with heartwarming moments and cherished memories. Attendees shared their wishes and celebrated the enduring bond of the couple. The evening featured a delightful dinner, music, and dancing. It was a beautiful occasion that highlighted the couple's journey and the love they share, creating memories to last a lifetime."
  }
];

const Events = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const getTruncatedText = (text, isExpanded) => {
    if (isExpanded || window.innerWidth > 768) {
      return text;
    }
    const truncated = text.split(" ").slice(0, 20).join(" ");
    return truncated.length < text.length ? `${truncated}...` : text;
  };

  return (
    <>
      <div className="container mt-3 p-3" id='events'>
        <h1 className="text-center mb-5 title-gradient">Events</h1>
        <div className="row justify-content-center">
          {eventsData.map((event, index) => (
            <div className="col-md-6 mb-4" key={index}>
              <div className="card event-card shadow">
                <div className="img-container">
                  <img src={event.image} alt={event.title} className="card-img-top img-fluid rounded" />
                </div>
                <div className="card-body">
                  <h5 className="card-title">{event.title}</h5>
                  <p className="card-text text-muted">
                    <FaCalendarAlt className='me-md-2 me-1' /> {event.date}
                  </p>
                  <p className="card-text">
                    {getTruncatedText(event.description, expandedIndex === index)}
                    {window.innerWidth <= 768 && (
                      <button className="btn btn-link p-0 ms-2" onClick={() => toggleExpand(index)}>
                        {expandedIndex === index ? "Show Less" : "Show More"}
                      </button>
                    )}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="row justify-content-center mt-5">
          <div className="col-md-8 text-center">
            <h2 className="title-gradient">Give Us a Chance to Organize Your Next Event!</h2>
            <p className="lead mt-3">
              Whether it's a birthday celebration, farewell party, team meeting, or any special occasion, we are here to make it memorable. Our team is dedicated to providing exceptional event planning services tailored to your needs. Let's create unforgettable moments together!
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Events;
