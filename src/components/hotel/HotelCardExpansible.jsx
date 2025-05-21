import React, { useState } from "react";
import { MagicCard } from "react-magic-motion";
import "react-magic-motion/card.css";

function CloseFullscreenSvg() {
  return (
    <>
      <rect x="1" y="16" width="14" height="15" stroke="currentColor" strokeWidth="2" />
      <path d="M26 5L18 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M18 13H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M18 13V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <rect x="1" y="1" width="30" height="30" stroke="currentColor" strokeWidth="2" />
    </>
  );
}

function OpenFullscreenSvg() {
  return (
    <>
      <rect x="1" y="8" width="21" height="23" stroke="currentColor" strokeWidth="2" />
      <path d="M7 24L15 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M15 16H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M15 16V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <rect x="1" y="1" width="30" height="30" stroke="currentColor" strokeWidth="2" />
    </>
  );
}

export const HotelCardExpandible = ({ hotel }) => {
  const [isCardExpanded, setIsCardExpanded] = useState(false);

  return (
    <MagicCard
      isCardExpanded={isCardExpanded}
      onBackgroundFadeClick={() => setIsCardExpanded(false)}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      <div
        style={{
          width: isCardExpanded ? "40rem" : "17rem",
          gap: "1rem",
          display: "flex",
          flexDirection: "column",
          padding: "1.35rem 0",
          color: "currentColor",
          backgroundColor: "transparent",
          borderRadius: 12,
          boxShadow: isCardExpanded ? "0 8px 20px rgba(0,0,0,0.1)" : "none",
          cursor: "pointer",
        }}
      >
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <h3 style={{ fontWeight: 600, fontSize: "1.4em", margin: 0, flex: 1 }}>{hotel.name}</h3>

          <button
            style={{
              position: "absolute",
              right: 0,
              zIndex: 9999,
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
            onClick={() => setIsCardExpanded(!isCardExpanded)}
            aria-label={isCardExpanded ? "Cerrar tarjeta" : "Abrir tarjeta"}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isCardExpanded ? <CloseFullscreenSvg /> : <OpenFullscreenSvg />}
            </svg>
          </button>
        </div>

        <div style={{ overflowY: "auto" }}>
            <img
                style={{
                    width: isCardExpanded ? "24rem" : "17.5rem",
                    height: "auto",
                    borderRadius: 8,
                }}
                alt={`Imagen de ${hotel.name}`}
                src="https://images.unsplash.com/photo-1703573198451-8d5210fa8b8b?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE0fHx8ZW58MHx8fHx8"
            />

          {isCardExpanded && (
            <section
                style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                marginTop: 12,
                fontSize: "1.1rem",         
                lineHeight: "1.5",           
                }}
            >
                <h4
                style={{
                    fontSize: "1.5rem",      
                    fontWeight: 700,
                    marginBottom: 8,
                }}
                >
                Dirección:
                </h4>
                <p style={{ margin: 0 }}>{hotel.address || "Dirección no disponible"}</p>

                {hotel.description && (
                <>
                    <h4
                    style={{
                        fontSize: "1.5rem",
                        fontWeight: 700,
                        marginBottom: 8,
                        marginTop: 16,
                    }}
                    >
                    Descripción:
                    </h4>
                    <p style={{ margin: 0 }}>{hotel.description}</p>
                </>
                )}
            </section>
          )}
        </div>
      </div>
    </MagicCard>
  );
};
