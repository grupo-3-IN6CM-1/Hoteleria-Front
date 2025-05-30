// src/pages/users/UsersPage.jsx
import React, { useState, useEffect } from "react";
import { Layout, Typography, Table, Avatar, Spin, message, Tabs } from "antd";
import { Sidebar } from "../../components/sidebar/Sidebar";
import { UserOutlined } from "@ant-design/icons";
import { getAllUsers } from "../../services/api"; // Asegúrate que tienes este endpoint
const { Title } = Typography;
const { Header, Content } = Layout;
const { TabPane } = Tabs;

export const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estado para la pestaña activa
  const [activeRole, setActiveRole] = useState("ALL");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getAllUsers();
        if (!res.error) setUsers(res.data.users || []);
        else message.error("Error al cargar usuarios");
      } catch {
        message.error("Error de conexión al cargar usuarios");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const columns = [
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      render: () => <Avatar icon={<UserOutlined />} />,
    },
    {
      title: "Usuario",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Correo",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Rol",
      dataIndex: "role",
      key: "role",
    },
  ];

  // Filtrar usuarios según el rol activo
  const filteredUsers = activeRole === "ALL"
    ? users
    : users.filter(user => user.role === activeRole);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout style={{ marginLeft: 250 }}>
        <Header
          style={{
            background: "#fff",
            padding: "0 24px",
            boxShadow: "0 2px 8px #f0f1f2",
          }}
        >
          <Title level={3} style={{ margin: 0 }}>
            Usuarios
          </Title>
        </Header>
        <Content style={{ padding: 20, background: "#f0f2f5" }}>
          {loading ? (
            <Spin tip="Cargando usuarios..." style={{ display: "block", margin: "40px auto" }} />
          ) : (
            <>
              <Tabs activeKey={activeRole} onChange={setActiveRole} type="line" style={{ marginBottom: 20 }}>
                <TabPane tab="Todos" key="ALL" />
                <TabPane tab="PLATFORM_ADMIN" key="PLATFORM_ADMIN" />
                <TabPane tab="HOTEL_ADMIN" key="HOTEL_ADMIN" />
                <TabPane tab="CLIENT" key="CLIENT" />
                {/* Agrega más roles aquí si es necesario */}
              </Tabs>
              <Table
                dataSource={filteredUsers}
                columns={columns}
                rowKey={(record) => record._id}
                pagination={{ pageSize: 10 }}
              />
            </>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};
