import React, { useState } from "react";
import { Layout, Typography, Button, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Sidebar } from "../../components/sidebar/Sidebar.jsx";
import { HotelsList } from "../../components/hotel/HotelsList.jsx";
import { UserProfileModal } from "../../components/UserProfileModal";

const { Header, Content } = Layout;
const { Title } = Typography;

export const HotelsPage = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  // const { role } = user;  // no usamos el rol para ahora mostrar la lista

  const [modalVisible, setModalVisible] = useState(false);

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
            Gestión de Hoteles
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

        <Content style={{ padding: 20, background: "#f0f2f5" }}>
          {/* Mostramos HotelsList sin importar rol para probar */}
          <HotelsList />
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
