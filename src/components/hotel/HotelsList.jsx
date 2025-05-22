import React, { useState, useEffect } from "react";
import { Input, Spin, Alert, Empty, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useHotels } from "../../shared/hooks/useHotels";
import { HotelCardExpandible } from "../hotel/HotelCardExpansible";

const { Title } = Typography;

export const HotelsList = ({ onSelectHotel, selectedHotel }) => {
  const { hotels = [], isLoading, error } = useHotels();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredHotels, setFilteredHotels] = useState([]);

  useEffect(() => {
    const filtered = hotels.filter((hotel) =>
      hotel.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredHotels(filtered);
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

  if (filteredHotels.length === 0)
    return (
      <>
        <Input
          prefix={<SearchOutlined style={{ color: "#1890ff" }} />}
          placeholder="Buscar hoteles por nombre"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          allowClear
          style={{ marginBottom: 24, borderRadius: 6 }}
          aria-label="Buscar hoteles"
        />
        <Empty description="No se encontraron hoteles" />
      </>
    );

  return (
    <div style={{ maxWidth: 900, margin: "40px auto" }}>
      <Title
        level={3}
        style={{ textAlign: "center", marginBottom: 24, color: "#1890ff" }}
      >
        Lista de Hoteles
      </Title>

      <Input
        prefix={<SearchOutlined style={{ color: "#1890ff" }} />}
        placeholder="Buscar hoteles por nombre"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        allowClear
        style={{ marginBottom: 24, borderRadius: 6 }}
        aria-label="Buscar hoteles"
      />

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          justifyContent: "center",
        }}
      >
        {filteredHotels.map((hotel) => (
          <div
            key={hotel._id}
            onClick={() => onSelectHotel && onSelectHotel(hotel)}
            style={{
              border:
                selectedHotel?._id === hotel._id
                  ? "2px rgb(253, 253, 253)"
                  : "none",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            <HotelCardExpandible hotel={hotel} />
          </div>
        ))}
      </div>
    </div>
  );
};
