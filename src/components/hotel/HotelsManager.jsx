import React, { useState, useEffect } from "react";
import {
  List,
  Input,
  Spin,
  Alert,
  Card,
  Typography,
  Empty,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useHotels } from "../../shared/hooks/useHotels";

const { Title } = Typography;

export const HotelsManager = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  // No usamos role ni hotelAdminId para filtrar
  // Solo usamos para mostrar la lista completa
  
  const { hotels = [], isLoading, error } = useHotels(); // quitamos filtros para traer todos los hoteles
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredHotels, setFilteredHotels] = useState([]);

  useEffect(() => {
    // Siempre filtramos todos los hoteles por el searchTerm
    setFilteredHotels(
      hotels.filter((hotel) =>
        hotel.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, hotels]);

  if (isLoading)
    return (
      <Spin
        tip="Cargando hoteles..."
        size="large"
        style={{ display: "block", margin: "40px auto" }}
      />
    );

  if (error)
    return (
      <Alert
        message="Error al cargar hoteles"
        description={error.message}
        type="error"
        showIcon
        style={{ margin: "20px" }}
      />
    );

  return (
    <Card
      style={{
        maxWidth: 800,
        margin: "40px auto",
        padding: 24,
        borderRadius: 12,
        boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
        backgroundColor: "#fff",
      }}
    >
      <Title level={3} style={{ textAlign: "center", marginBottom: 24, color: "#1890ff" }}>
        Lista de Hoteles
      </Title>

      <Input
        prefix={<SearchOutlined style={{ color: "#1890ff" }} />}
        placeholder="Buscar hoteles por nombre"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        allowClear
        style={{
          marginBottom: 24,
          borderRadius: 6,
          transition: "box-shadow 0.3s ease",
        }}
        onFocus={(e) => (e.currentTarget.style.boxShadow = "0 0 8px #1890ff")}
        onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
        aria-label="Buscar hoteles"
      />

      {filteredHotels.length === 0 ? (
        <Empty description="No se encontraron hoteles" />
      ) : (
        <List
          bordered
          style={{ maxHeight: 420, overflowY: "auto", borderRadius: 6 }}
          dataSource={filteredHotels}
          renderItem={(hotel) => (
            <List.Item key={hotel._id || hotel.id || hotel.name}>
              <List.Item.Meta
                title={hotel.name}
                description={hotel.address}
              />
            </List.Item>
          )}
        />
      )}
    </Card>
  );
};
