import { useState, useEffect } from "react";
import { Typography, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../../components/sidebar/Sidebar.jsx";

const { Title, Text } = Typography;

export const Dashboard = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const { username } = JSON.parse(storedUser);
      setUsername(username);
    }
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <main
        style={{
          flexGrow: 1,
          padding: 24,
          marginLeft: 250, // ancho fijo del sidebar
          backgroundColor: "#f0f2f5",
          minHeight: "100vh",
        }}
      >
        <Title level={2}>Bienvenido, {username || "Usuario"}</Title>
        <Text>Este es tu panel principal.</Text>

        <div style={{ marginTop: 24 }}>
          <Button type="primary" onClick={() => navigate("/hotels")}>
            Ver Hoteles
          </Button>
        </div>
      </main>
    </div>
  );
};
