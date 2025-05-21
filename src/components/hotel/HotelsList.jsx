import React, { useState, useMemo } from "react";
import { List, Input, Spin, Alert, Empty, Card, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useHotels } from "../../shared/hooks/useHotels";

const { Title } = Typography;

const getUserFromStorage = () => {
  try {
    return JSON.parse(localStorage.getItem("user")) || {};
  } catch {
    return {};
  }
};

export const HotelsList = () => {
  // Obtenemos usuario solo para mantener el buscador visible, aunque no filtre
  const { role } = getUserFromStorage();

  const { hotels = [], isLoading, error } = useHotels();

  // El searchTerm sólo afectará el input pero no filtrará nada
  const [searchTerm, setSearchTerm] = useState("");

  // filteredHotels es igual a todos los hoteles (sin filtro)
  const filteredHotels = hotels;

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
        maxWidth: 700,
        margin: "40px auto",
        padding: 24,
        boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
        borderRadius: 10,
      }}
    >
      <Title level={3} style={{ textAlign: "center", marginBottom: 24, color: "#1890ff" }}>
        Lista de Hoteles
      </Title>

      {/* Mostramos el buscador pero sin efecto en la lista */}
      <Input
        prefix={<SearchOutlined style={{ color: "#1890ff" }} />}
        placeholder="Buscar hoteles (sin filtro)"
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
            <List.Item key={hotel.id || hotel._id || hotel.name}>
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
