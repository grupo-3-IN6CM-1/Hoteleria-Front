// src/pages/room/ReservationsPage.jsx
import React, { useState, useEffect } from "react";
import {
  Layout,
  Typography,
  Button,
  Avatar,
  Row,
  Col,
  Modal,
  Form,
  DatePicker,
  Select,
  Alert,
  message,
  Spin,
} from "antd";
import { UserOutlined, PlusOutlined } from "@ant-design/icons";
import { Sidebar } from "../../components/sidebar/Sidebar";
import SpotlightCard from "../../components/card/SpotlightCard";
import {
  createReservation,
  getReservationsByUsername,
  getMyReservations,      // renombrado para HOTEL_ADMIN
  getReservations,
  updateReservationStatus,
} from "../../services/api";
import { useHotels } from "../../shared/hooks/useHotels";
import { useRoomsByHotel } from "../../shared/hooks/useRoomsByHotel";
import { UserProfileModal } from "../../components/UserProfileModal";
import "./ReservationsPage.css";

const { Title } = Typography;
const { Header, Content } = Layout;
const { RangePicker } = DatePicker;
const { Option } = Select;

export const ReservationsPage = () => {
  const [user, setUser] = useState(null);
  const [profileVisible, setProfileVisible] = useState(false);
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [selectedRoomInfo, setSelectedRoomInfo] = useState(null);
  const [alert, setAlert] = useState({ type: null, message: "" });
  const [form] = Form.useForm();

  const { hotels } = useHotels(user?.role, user?.uid);
  const { rooms } = useRoomsByHotel(selectedHotel);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargo el usuario
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  // Cargo las reservaciones según rol
  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      setLoading(true);
      try {
        let res;
        if (user.role === "PLATFORM_ADMIN") {
          res = await getReservations();
        } else if (user.role === "HOTEL_ADMIN") {
          res = await getMyReservations();
        } else {
          res = await getReservationsByUsername(user.username);
        }
        if (!res.error) setReservations(res.data.reservations || []);
        else message.error("Error al cargar reservaciones");
      } catch {
        message.error("Error de conexión al cargar reservaciones");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user]);

  // Handler para marcar como pagada
  const handlePayReservation = async (id) => {
    try {
      const res = await updateReservationStatus(id, "COMPLETED");
      if (!res.error) {
        message.success("Reservación pagada");
        // refresca lista
        const updated = await getReservationsByUsername(user.username);
        setReservations(updated.data.reservations || []);
      }
    } catch {
      message.error("Error al procesar el pago");
    }
  };

  // Handler de creación (CLIENT)
  const handleFinish = async (values) => {
    const [checkIn, checkOut] = values.dateRange;
    const data = {
      hotel: values.hotel,
      room: values.room,
      checkIn: checkIn.toISOString(),
      checkOut: checkOut.toISOString(),
    };
    setAlert({ type: null, message: "" });
    try {
      const res = await createReservation(data);
      if (!res.error) {
        setAlert({ type: "success", message: "¡Reservación creada!" });
        form.resetFields();
        setSelectedRoomInfo(null);
        // refresca lista
        const updated = await getReservationsByUsername(user.username);
        setReservations(updated.data.reservations || []);
        setTimeout(() => {
          setFormModalVisible(false);
          setAlert({ type: null, message: "" });
        }, 1500);
      } else {
        setAlert({
          type: "error",
          message: res.e?.response?.data?.msg || "Error al crear reserva",
        });
      }
    } catch {
      setAlert({ type: "error", message: "Error inesperado" });
    }
  };

  // Inicio del render
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />

      <Layout style={{ marginLeft: 250 }}>
        <Header
          style={{
            background: "#fff",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            boxShadow: "0 2px 8px #f0f1f2",
          }}
        >
          <Title level={3} style={{ margin: 0 }}>
            Reservaciones
          </Title>
          <Button
            type="text"
            onClick={() => setProfileVisible(true)}
            style={{ marginLeft: "auto", display: "flex", alignItems: "center" }}
          >
            <Avatar
              icon={<UserOutlined />}
              size="small"
              style={{ backgroundColor: "#1890ff", marginRight: 8 }}
            />
            {user?.username}
          </Button>
        </Header>

        <Content
          style={{
            padding: 20,
            background: "#f0f2f5",
            overflowY: "auto",
            maxHeight: "calc(100vh - 64px)", // ajusta según la altura del Header
          }}
        >
          <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
            {/* Tarjeta de “+” sólo para CLIENT */}
            {user?.role === "CLIENT" && (
              <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    form.resetFields();
                    setSelectedRoomInfo(null);
                    setFormModalVisible(true);
                  }}
                >
                  <SpotlightCard spotlightColor="rgba(0, 123, 255, 0.3)">
                    <div
                      style={{
                        height: 200,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        color: "white",
                      }}
                    >
                      <PlusOutlined style={{ fontSize: "48px" }} />
                    </div>
                  </SpotlightCard>
                </div>
              </Col>
            )}

            {/* Tarjetas de reservaciones */}
            {!loading &&
              reservations.map((r) => (
                <Col xs={24} sm={12} md={8} lg={6} xl={4} key={r._id}>
                  <SpotlightCard spotlightColor="rgba(0,0,0,0.5)">
                    <div style={{ padding: 16, color: "white" }}>
                      <p>
                        <b>Reservado por:</b> {r.user?.username}
                      </p>
                      <Title level={4} style={{ color: "white" }}>
                        {r.hotel?.name}
                      </Title>
                      <p>
                        <b>Habitación:</b> {r.room?.number} ({r.room?.type})
                      </p>
                      <p>
                        <b>Fechas:</b>{" "}
                        {new Date(r.checkIn).toLocaleDateString()}—
                        {new Date(r.checkOut).toLocaleDateString()}
                      </p>
                      <p>
                        <b>Total:</b> ${r.totalPrice}
                      </p>
                      <p>
                        <b>Estado:</b> {r.status}
                      </p>
                      {user?.role === "CLIENT" && r.status === "CONFIRMED" && (
                        <Button
                          style={{ marginTop: 8 }}
                          onClick={() => handlePayReservation(r._id)}
                        >
                          Pagar ahora
                        </Button>
                      )}
                    </div>
                  </SpotlightCard>
                </Col>
              ))}

            {/* Spinner mientras carga */}
            {loading && (
              <Col span={24} style={{ textAlign: "center", marginTop: 40 }}>
                <Spin size="large" />
              </Col>
            )}
          </Row>
        </Content>
      </Layout>

      {/* Modal de perfil */}
      <UserProfileModal
        visible={profileVisible}
        onClose={() => setProfileVisible(false)}
        user={user}
      />

      {/* Modal de creación (CLIENT) */}
      <Modal
        title="Crear Nueva Reservación"
        open={formModalVisible}
        onCancel={() => {
          form.resetFields();
          setSelectedRoomInfo(null);
          setAlert({ type: null, message: "" });
          setFormModalVisible(false);
        }}
        footer={null}
      >
        {alert.type && (
          <Alert
            message={alert.message}
            type={alert.type}
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <Form layout="vertical" form={form} onFinish={handleFinish}>
          <Form.Item
            name="hotel"
            label="Hotel"
            rules={[{ required: true, message: "Seleccione un hotel" }]}
          >
            <Select
              placeholder="Seleccionar hotel"
              onChange={(value) => {
                form.setFieldsValue({ room: undefined });
                setSelectedHotel(value);
                setSelectedRoomInfo(null);
              }}
            >
              {hotels.map((h) => (
                <Option key={h._id} value={h._id}>
                  {h.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="room"
            label="Habitación"
            rules={[{ required: true, message: "Seleccione una habitación" }]}
          >
            <Select
              placeholder="Seleccionar habitación"
              disabled={!selectedHotel}
              onChange={(rid) => {
                const rm = rooms.find((x) => x._id === rid);
                setSelectedRoomInfo(rm || null);
                form.setFieldsValue({ room: rid });
              }}
            >
              {rooms.map((room) => (
                <Option key={room._id} value={room._id}>
                  Habitación {room.number}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {selectedRoomInfo && (
            <div style={{ marginBottom: 16 }}>
              <p>
                <b>Tipo:</b> {selectedRoomInfo.type}
              </p>
              <p>
                <b>Precio por noche:</b> ${selectedRoomInfo.pricePerNight}
              </p>
              <p>
                <b>Descripción:</b> {selectedRoomInfo.description}
              </p>
            </div>
          )}

          <Form.Item
            name="dateRange"
            label="Fechas de reservación"
            rules={[{ required: true, message: "Seleccione fechas" }]}
          >
            <RangePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Registrar Reservación
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};
