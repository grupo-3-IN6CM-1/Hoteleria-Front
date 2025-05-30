import React, { useState, useEffect } from "react";
import { Layout, Button, Avatar, Typography, Spin, Alert } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Sidebar } from "../../components/sidebar/Sidebar";
import { UserProfileModal } from "../../components/UserProfileModal";
import EventCard from "../../components/event/EventCard";
import { useEvents } from "../../shared/hooks/useEvents";

const { Header, Content } = Layout;
const { Title } = Typography;

export const EventPage = () => {
  const [user, setUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const { events, loading, error } = useEvents();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />

      <Layout style={{ marginLeft: 250 }}>
        <Header
          style={{
            background: "#fff",
            padding: "0 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 2px 8px #f0f1f2",
          }}
        >
          <Title level={3} style={{ margin: 0 }}>
            Eventos
          </Title>

          <Button
            type="text"
            onClick={() => setModalVisible(true)}
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <Avatar
              icon={<UserOutlined />}
              size="small"
              style={{ backgroundColor: "#1890ff" }}
            />
            <span>{user?.username || "Usuario"}</span>
          </Button>
        </Header>

        <Content style={{ padding: 24, background: "#0d0d0d" }}>
          {loading ? (
            <div style={{ textAlign: "center", marginTop: 50 }}>
              <Spin size="large" />
            </div>
          ) : error ? (
            <Alert message="Error cargando eventos" type="error" showIcon />
          ) : (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "24px",
                justifyContent: "center",
              }}
            >
              {events.map((event) => (
                <EventCard
                  key={event._id}
                  title={event.title}
                  date={new Date(event.date).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  location={event.hotel?.name || "Ubicación no disponible"}
                  description={event.description}
                  host={`${event.user?.name ?? "Desconocido"} ${event.user?.surname ?? ""}`.trim()}
                />
              ))}
            </div>
          )}
        </Content>
      </Layout>

      <UserProfileModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        user={user}
      />
    </Layout>
  );
};
