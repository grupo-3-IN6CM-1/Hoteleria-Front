import React from "react";
import { Sidebar } from "../../components/sidebar/Sidebar";

export const ReservationsPage = () => {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <main style={{ marginLeft: 250, padding: 20, width: "100%" }}>
        <h1>Mis Reservaciones</h1>
      </main>
    </div>
  );
};
