import React, { useState, useEffect } from "react";
import { Typography, Button, Layout, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Sidebar } from "../../components/sidebar/Sidebar.jsx";
import { UserProfileModal } from "../../components/UserProfileModal";
import Waves from "../../components/waves/Waves.jsx";
import { DashboardCard } from "../../components/card/DashboardCard.jsx";

const { Title, Text } = Typography;
const { Header, Content } = Layout;

export const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const isPlatformAdmin = user?.role === "PLATFORM_ADMIN";
  const isClient = user?.role === "CLIENT";

  return (
    <Layout style={{ minHeight: "100vh", position: "relative" }}>
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
            position: "relative",
            zIndex: 10,
          }}
        >
          <Title level={3} style={{ margin: 0 }}>
            Panel Principal
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

        <Content
          style={{
            padding: 24,
            background: "#f0f2f5",
            minHeight: "calc(100vh - 64px)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {isPlatformAdmin && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: 200,
                pointerEvents: "none",
                zIndex: 0,
              }}
            >
              <Waves
                lineColor="#fff"
                backgroundColor="rgba(255, 255, 255, 0.15)"
                waveSpeedX={0.02}
                waveSpeedY={0.01}
                waveAmpX={40}
                waveAmpY={20}
                friction={0.9}
                tension={0.01}
                maxCursorMove={120}
                xGap={12}
                yGap={36}
              />
            </div>
          )}

          <div style={{ position: "relative", zIndex: 1 }}>
            <Title level={2}>Bienvenido, {user?.username || "Usuario"}</Title>
            <Text>¿Qué quieres hacer hoy?</Text>
          </div>

          {isClient && (
            <div
              style={{
                display: "flex",
                gap: 20,
                flexWrap: "wrap",
                justifyContent: "center",
                marginTop: 32,
              }}
            >
              <DashboardCard
                title="Haz una reservación ya!"
                subtitle="Reserva tu habitación en segundos"
                icon={<i className="fas fa-calendar-check" />}
              />
              <DashboardCard
                title="Quiero hacer un evento"
                subtitle="Organiza tu evento con nosotros"
                icon={<i className="fas fa-calendar-alt" />}
              />
              <DashboardCard
                title="Mi historial de reservaciones"
                subtitle="Consulta tus reservas anteriores"
                icon={<i className="fas fa-history" />}
              />
              <DashboardCard
                title="Mi habitación"
                subtitle="Accede a tu habitación y servicios"
                icon={<i className="fas fa-bed" />}
              />
            </div>
          )}
        </Content>
      </Layout>

      {isPlatformAdmin && (
        <Waves
          lineColor="#fff"
          backgroundColor="rgba(0, 0, 0, 0.15)"
          waveSpeedX={0.02}
          waveSpeedY={0.01}
          waveAmpX={40}
          waveAmpY={20}
          friction={0.9}
          tension={0.01}
          maxCursorMove={120}
          xGap={12}
          yGap={36}
          style={{ zIndex: 0 }}
        />
      )}

      <UserProfileModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        user={user}
      />
    </Layout>
  );
};
