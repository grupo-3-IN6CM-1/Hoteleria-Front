// src/pages/account/MyAccountPage.jsx
import React, { useState, useEffect } from "react";
import {
  Layout,
  Typography,
  Card,
  Button,
  Descriptions,
  message,
  Spin,
  Form,
  Input,
  Row,
  Col,
} from "antd";
import { EditOutlined, UserOutlined } from "@ant-design/icons";
import { Sidebar } from "../../components/sidebar/Sidebar";
import { getMyProfile, updateMyProfile } from "../../services/api";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

export const MyAccountPage = () => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await getMyProfile();
        if (!res.error && res.data.user) {
          setUser(res.data.user);
          form.setFieldsValue({
            username: res.data.user.username,
            email: res.data.user.email,
            name: res.data.user.name || "",
            password: "",
          });
        } else {
          message.error("Error al cargar perfil.");
        }
      } catch {
        message.error("Error de conexión.");
      }
      setLoading(false);
    };
    fetchProfile();
  }, []); // <= solo una vez al montar

  const onFinish = async (values) => {
    if (!user || !(user._id || user.id)) {
      message.error("Usuario no disponible.");
      return;
    }
    setLoading(true);
    try {
      const userId = user._id || user.id;
      const res = await updateMyProfile(userId, values);
      if (!res.error) {
        message.success("Perfil actualizado correctamente.");
        const updatedUser = { ...user, ...values };
        if (!values.password) delete updatedUser.password;
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setEditing(false);
        form.resetFields();
        form.setFieldsValue({
          username: updatedUser.username,
          email: updatedUser.email,
          name: updatedUser.name || "",
          password: "",
        });
      } else {
        message.error(res.msg || "Error al actualizar perfil");
      }
    } catch {
      message.error("Error inesperado al actualizar perfil");
    }
    setLoading(false);
  };

  if (loading && !user) {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Sidebar />
        <Layout style={{ marginLeft: 250 }}>
          <Header
            style={{
              background: "#fff",
              padding: "0 24px",
              boxShadow: "0 2px 8px #f0f2f2",
            }}
          >
            <Title level={3} style={{ margin: 0 }}>
              Mi Cuenta
            </Title>
          </Header>
          <Content
            style={{ padding: 24, background: "#f0f2f5", textAlign: "center" }}
          >
            <Spin tip="Cargando perfil..." size="large" />
          </Content>
        </Layout>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout style={{ marginLeft: 250, background: "#f0f2f5" }}>
        <Header
          style={{
            background: "#fff",
            padding: "0 24px",
            boxShadow: "0 2px 8px #f0f2f2",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Title level={3} style={{ margin: 0 }}>
            Mi Cuenta
          </Title>
          {!editing && (
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => setEditing(true)}
            >
              Editar Perfil
            </Button>
          )}
        </Header>

        <Content style={{ padding: 40 }}>
          <Row justify="center" gutter={32}>
            <Col xs={24} sm={20} md={16} lg={12} xl={10}>
              {!editing ? (
                <>
                  <Card
                    title="Datos Actuales"
                    bordered
                    style={{ boxShadow: "0 3px 10px rgb(0 0 0 / 0.1)" }}
                  >
                    <Descriptions
                      column={1}
                      bordered
                      size="middle"
                      layout="vertical"
                      labelStyle={{ fontWeight: "600" }}
                    >
                      <Descriptions.Item label="Usuario">
                        <Text>
                          <UserOutlined style={{ marginRight: 8 }} />
                          {user?.username || "—"}
                        </Text>
                      </Descriptions.Item>
                      <Descriptions.Item label="Correo">
                        <Text>{user?.email || "—"}</Text>
                      </Descriptions.Item>
                      <Descriptions.Item label="Nombre">
                        <Text>{user?.name || "—"}</Text>
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                  <div style={{ marginTop: 24, textAlign: "center" }}>
                    <Button
                      type="primary"
                      icon={<EditOutlined />}
                      onClick={() => setEditing(true)}
                      style={{ borderRadius: 6 }}
                    >
                      Editar Perfil
                    </Button>
                  </div>
                </>
              ) : (
                <Card
                  title="Editar Perfil"
                  bordered
                  style={{ boxShadow: "0 3px 10px rgb(0 0 0 / 0.1)" }}
                >
                  <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    disabled={loading}
                  >
                    <Form.Item
                      label="Usuario"
                      name="username"
                      rules={[{ required: true, message: "Ingrese su usuario" }]}
                    >
                      <Input disabled />
                    </Form.Item>
                    <Form.Item
                      label="Correo"
                      name="email"
                      rules={[
                        { required: true, message: "Ingrese su correo" },
                        { type: "email", message: "Ingrese un correo válido" },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item label="Nombre" name="name">
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label="Nueva contraseña"
                      name="password"
                      rules={[
                        {
                          min: 6,
                          message: "La contraseña debe tener mínimo 6 caracteres",
                        },
                      ]}
                    >
                      <Input.Password placeholder="Dejar vacío para no cambiar" />
                    </Form.Item>
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        block
                        loading={loading}
                        style={{ borderRadius: 6 }}
                      >
                        Guardar Cambios
                      </Button>
                    </Form.Item>
                    <Form.Item>
                      <Button
                        block
                        onClick={() => {
                          setEditing(false);
                          form.resetFields();
                          form.setFieldsValue({
                            username: user.username,
                            email: user.email,
                            name: user.name || "",
                            password: "",
                          });
                        }}
                        style={{ borderRadius: 6 }}
                      >
                        Cancelar
                      </Button>
                    </Form.Item>
                  </Form>
                </Card>
              )}
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};
