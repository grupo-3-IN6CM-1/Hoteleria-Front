import React from "react";
import { Modal, Avatar, Typography, Space, Button, Divider } from "antd";

const { Text, Title } = Typography;

export const UserProfileModal = ({ visible, onClose, user }) => {
  return (
    <Modal
      title="Información de Perfil"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" type="primary" onClick={onClose}>
          Cerrar
        </Button>,
      ]}
      centered
    >
      {user ? (
        <Space
          direction="vertical"
          size="large"
          style={{ width: "100%", alignItems: "center" }}
        >
          <Avatar
            size={100}
            src="https://static.wikia.nocookie.net/notcaukaso/images/5/59/John_pork.png/revision/latest?cb=20230924035537&path-prefix=es"
            alt="Imagen de perfil"
          />

          <Title level={4} style={{ marginBottom: 0 }}>
            {user.username}
          </Title>

          <Divider style={{ margin: "8px 0" }} />

          <Space direction="vertical" size="small" style={{ width: "100%" }}>
            <Text>
              <b>Rol:</b> {user.role}
            </Text>
            {user.email && (
              <Text>
                <b>Email:</b> {user.email}
              </Text>
            )}
            {/* Puedes agregar más campos aquí si los tienes */}
          </Space>
        </Space>
      ) : (
        <Text>No hay información disponible</Text>
      )}
    </Modal>
  );
};
