// src/pages/guest/GuestsPage.jsx
import React, { useState, useEffect } from "react";
import {
  Layout,
  Table,
  Input,
  Card,
  Avatar,
  Spin,
  Typography,
  message,
  Space,
} from "antd";
import { UserOutlined }      from "@ant-design/icons";
import { useMyGuests }       from "../../shared/hooks/useMyGuests";
import { Sidebar }           from "../../components/sidebar/Sidebar";
import { UserProfileModal }  from "../../components/UserProfileModal";

const { Header, Content } = Layout;
const { Title, Text }     = Typography;
const { Search }          = Input;

export const GuestsPage = () => {
  const [user, setUser]                     = useState(null);
  const [profileVisible, setProfileVisible] = useState(false);
  const [filter, setFilter]                 = useState("");
  const { guests, isLoading, error }        = useMyGuests();

  // Carga el usuario del localStorage
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  // Muestra error si falla la carga
  useEffect(() => {
    if (error) message.error("Error al cargar huéspedes");
  }, [error]);

  // Filtrado simple por username
  const handleSearch = (value) => {
    setFilter(value.trim().toLowerCase());
  };
  const data = guests.filter(g =>
    !filter || g.username.toLowerCase().includes(filter)
  );

  // Columnas de la tabla
  const columns = [
    {
      title: "Usuario",
      dataIndex: "username",
      key: "username",
      render: (name) => (
        <Text>
          <Avatar
            icon={<UserOutlined />}
            style={{ backgroundColor: "#1890ff", marginRight: 8 }}
          />
          {name}
        </Text>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />

      <Layout style={{ marginLeft: 250 }}>
        {/* Header personalizado */}
        <Header
          style={{
            background: "#fff",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          <Title level={3} style={{ margin: 0 }}>
            Huéspedes
          </Title>
          <Space style={{ marginLeft: "auto" }}>
            <Search
              placeholder="Buscar usuario"
              onSearch={handleSearch}
              allowClear
              style={{ width: 200 }}
            />
            <Avatar
              icon={<UserOutlined />}
              onClick={() => setProfileVisible(true)}
              style={{ backgroundColor: "#1890ff", cursor: "pointer" }}
            />
          </Space>
        </Header>

        <Content style={{ padding: 24, background: "#f0f2f5" }}>
          <Card styles={{ body: { padding: 0 } }}>
            {isLoading ? (
              <div style={{ textAlign: "center", margin: "40px 0" }}>
                <Spin size="large" />
                <div style={{ marginTop: 12 }}>Cargando huéspedes…</div>
              </div>
            ) : (
              <Table
                rowKey="_id"
                dataSource={data}
                columns={columns}
                pagination={{ pageSize: 8 }}
                bordered
                locale={{ emptyText: "No hay huéspedes que mostrar" }}
              />
            )}
          </Card>
        </Content>
      </Layout>

      <UserProfileModal
        visible={profileVisible}
        onClose={() => setProfileVisible(false)}
        user={user}
      />
    </Layout>
  );
};
