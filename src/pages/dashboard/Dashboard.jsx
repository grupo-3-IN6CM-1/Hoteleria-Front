import React, { useState, useEffect } from "react";
import { Typography, Button, Layout, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../../components/sidebar/Sidebar.jsx";
import { UserProfileModal } from "../../components/UserProfileModal";

const { Title, Text } = Typography;
const { Header, Content } = Layout;

export const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

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
          }}
        >
          <Title level={2}>Bienvenido, {user?.username || "Usuario"}</Title>
          <Text>Este es tu panel principal.</Text>

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
