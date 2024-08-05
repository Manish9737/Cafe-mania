import React from "react";
import { Card } from "react-bootstrap";
import "../Assets/CSS/card.css"

const CustomCard = ({ title, text, imageUrl, buttonText, onClick }) => {
  return (
    <Card className="my-card">
      <Card.Img variant="top" src={imageUrl} className="card-image" />
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{text}</Card.Text>
        <button className="btn-brown btn-sm rounded-pill" onClick={onClick}>{buttonText}</button>
        {/* <Button className="btn-brown">{buttonText}</Button> */}
      </Card.Body>
    </Card>
  );
};

export default CustomCard;
