import React, { useState } from "react";
import { Layout, Typography, Button, Avatar, Modal } from "antd";
import { UserOutlined, PlusOutlined, EditOutlined } from "@ant-design/icons";
import { Sidebar } from "../../components/sidebar/Sidebar.jsx";
import { HotelsList } from "../../components/hotel/HotelsList.jsx";
import { HotelsManager } from "../../components/hotel/HotelsManager.jsx"; 
import { UserProfileModal } from "../../components/UserProfileModal";

const { Header, Content } = Layout;
const { Title } = Typography;

export const HotelsPage = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const role = user.role || "";

  const [modalVisible, setModalVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null);

  const canEditOrAdd = role === "PLATFORM_ADMIN" || role === "HOTEL_ADMIN";

  const closeFormModal = () => {
    setFormVisible(false);
    setEditingHotel(null);
  };

  const openAddForm = () => {
    setEditingHotel(null);
    setFormVisible(true);
  };

  const openEditForm = () => {
    if (editingHotel) {
      setFormVisible(true);
    }
  };

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
            Hoteles
          </Title>

          {canEditOrAdd && (
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Button
                type="primary"
                onClick={openAddForm}
                icon={<PlusOutlined />}
                aria-label="Agregar Hotel"
              />

              <Button
                type="default"
                disabled={!editingHotel}
                onClick={openEditForm}
                icon={<EditOutlined />}
                aria-label="Editar Hotel"
              />
            </div>
          )}

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
          <HotelsList
            onSelectHotel={setEditingHotel}
            selectedHotel={editingHotel}
          />
        </Content>
      </Layout>

      <UserProfileModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        user={user}
      />

      <Modal
        title={editingHotel ? "Editar Hotel" : "Agregar Nuevo Hotel"}
        open={formVisible}
        onCancel={closeFormModal}
        footer={null}
        destroyOnHidden
        width={700}
      >
        <HotelsManager hotel={editingHotel} onAdded={closeFormModal} />
      </Modal>
    </Layout>
  );
};

