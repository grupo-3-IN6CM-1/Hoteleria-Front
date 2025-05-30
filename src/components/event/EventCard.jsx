import React, { useRef } from "react";
import "./EventCard.css";
import {
  CalendarOutlined, StarOutlined
} from "@ant-design/icons";


const EventCard = ({ title, date, location, description, host, className = "", spotlightColor = "rgba(255, 255, 255, 0.25)" }) => {
  const cardRef = useRef(null);

  const renderRoomIcons = (type) => {
      const icon = <CalendarOutlined style={{ fontSize: 40, marginRight: 4, color: "white" }} />;

      return null;
    };

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    cardRef.current.style.setProperty("--mouse-x", `${x}px`);
    cardRef.current.style.setProperty("--mouse-y", `${y}px`);
    cardRef.current.style.setProperty("--spotlight-color", spotlightColor);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`event-card ${className}`}
    >
      <div className="event-icon-container">
        <CalendarOutlined className="event-icon" />
      </div>

      <h3 className="event-title">{title}</h3>

      <p className="event-host">
        <strong>Anfitrión:</strong> {host}
      </p>
      <p className="event-date">
        <strong>Fecha:</strong> {date}
      </p>
      <p className="event-location">
        <strong>Hotel:</strong> {location}
      </p>
      <p className="event-description">
        <strong>Descripción del evento:</strong> {description}
      </p>
    </div>
  );
};

export default EventCard;
