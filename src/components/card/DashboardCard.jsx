import React from "react";
import SpotlightCard from "./SpotLightCard";
import "./DashboardCard.css";

export const DashboardCard = ({ title, subtitle, onClick, icon }) => {
  return (
    <SpotlightCard className="dashboard-card" spotlightColor="rgb(171, 169, 169)">
      <div
        className="dashboard-card-content"
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => { if (e.key === "Enter") onClick(); }}
        style={{ flexDirection: "column", alignItems: "flex-start", justifyContent: "space-between" }}
      >
        <div className="dashboard-card-left" style={{ flexDirection: "column", alignItems: "flex-start", gap: "1rem" }}>
          {icon && <span className="dashboard-card-icon">{icon}</span>}
          <div className="dashboard-card-text">
            <h2 className="dashboard-card-title">{title}</h2>
            <p className="dashboard-card-subtitle">{subtitle}</p>
          </div>
        </div>

        <button className="dashboard-card-button" type="button" onClick={onClick}>
          Acción
        </button>
      </div>
    </SpotlightCard>
  );
};
