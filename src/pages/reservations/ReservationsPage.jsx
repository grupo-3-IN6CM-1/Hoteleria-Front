// src/pages/reservation/ReservationsPage.jsx
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
} from "antd";
import { UserOutlined, PlusOutlined } from "@ant-design/icons";
import { Sidebar } from "../../components/sidebar/Sidebar";
import SpotlightCard from "../../components/card/SpotlightCard";
import {
  createReservation,
  getReservationsByUsername,
  getMyReservations,      
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

  const { hotels } = useHotels(user?.role, user?.hotel);
  const { rooms } = useRoomsByHotel(selectedHotel);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carga usuario de localStorage
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  // Carga reservaciones según rol
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
        } else if (user.role === "CLIENT") {
          res = await getReservationsByUsername(user.username);
        }

        if (!res.error) {
          setReservations(res.data.reservations || []);
        } else {
          message.error("Error al cargar reservaciones");
        }
      } catch {
        message.error("Error de conexión al cargar reservaciones");
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [user]);

  // Crear nueva reservación (CLIENT)
  const handleFinish = async (values) => {
    const [checkIn, checkOut] = values.dateRange;
    const data = {
      hotel: values.hotel,
      room: values.room,
      checkIn: checkIn.toISOString(),
      checkOut: checkOut.toISOString(),
    };

    try {
      const res = await createReservation(data);
      if (!res.error) {
        setAlert({ type: "success", message: "¡Reservación creada exitosamente!" });
        form.resetFields();
        setSelectedRoomInfo(null);

        // Actualiza lista de reservas cliente
        const updated = await getReservationsByUsername(user.username);
        setReservations(updated.data.reservations || []);

        setTimeout(() => {
          setFormModalVisible(false);
          setAlert({ type: null, message: "" });
        }, 2000);
      } else {
        setAlert({
          type: "error",
          message: res.e?.response?.data?.msg || "Error al registrar reservación",
        });
      }
    } catch {
      setAlert({
        type: "error",
        message: "Error inesperado al intentar registrar la reservación",
      });
    }
  };

  // Marcar pagada (CLIENT)
  const handlePayReservation = async (id) => {
    try {
      const res = await updateReservationStatus(id, "COMPLETED");
      if (!res.error) {
        message.success("Reservación pagada con éxito ✅");
        const updated = await getReservationsByUsername(user.username);
        setReservations(updated.data.reservations || []);
      }
    } catch {
      message.error("Error al procesar el pago ❌");
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout style={{ marginLeft: 250 }}>
        <Header className="header-bar">
          <Title level={3} style={{ margin: 0 }}>Reservaciones</Title>
          <Button
            type="text"
            onClick={() => setProfileVisible(true)}
            className="user-button"
          >
            <Avatar
              icon={<UserOutlined />}
              size="small"
              style={{ backgroundColor: "#1890ff" }}
            />
            <span>{user?.username || "Usuario"}</span>
          </Button>
        </Header>

        <Content style={{ padding: 24, background: "#f0f2f5" }}>
          <Row gutter={[16, 16]}>
            {user?.role === "CLIENT" && (
              <Col span={8}>
                <div
                  onClick={() => setFormModalVisible(true)}
                  style={{ cursor: "pointer" }}
                >
                  <SpotlightCard spotlightColor="rgba(255, 255, 255, 0.3)">
                    <div className="reservation-card-add">
                      <PlusOutlined style={{ fontSize: "84px" }} />
                    </div>
                  </SpotlightCard>
                </div>
              </Col>
            )}

            {!loading && reservations.map((r) => (
              <Col span={8} key={r._id}>
                <SpotlightCard spotlightColor="rgba(255, 255, 255, 0.3)">
                  <div className="reservation-card">
                    {/* Muestra quién reservó */}
                    <p><b>Reservado por:</b> {r.user?.username || "—"}</p>
                    <Title level={4} style={{ color: "white" }} className="card-title">
                      {r.hotel?.name}
                    </Title>
                    <p><b>Habitación:</b> {r.room?.number} ({r.room?.type})</p>
                    <p>
                      <b>Fechas:</b>{" "}
                      {new Date(r.checkIn).toLocaleDateString()} –{" "}
                      {new Date(r.checkOut).toLocaleDateString()}
                    </p>
                    <p><b>Total:</b> ${r.totalPrice}</p>
                    <p><b>Estado:</b> {r.status}</p>
                    {user?.role === "CLIENT" && r.status === "CONFIRMED" && (
                      <Button
                        type="dark"
                        style={{ color: "white" }}
                        onClick={() => handlePayReservation(r._id)}
                      >
                        Pagar ahora
                      </Button>
                    )}
                  </div>
                </SpotlightCard>
              </Col>
            ))}
          </Row>

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
                  {hotels.map((hotel) => (
                    <Option key={hotel._id} value={hotel._id}>
                      {hotel.name}
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
                  onChange={(roomId) => {
                    const room = rooms.find((r) => r._id === roomId);
                    setSelectedRoomInfo(room || null);
                    form.setFieldsValue({ room: roomId });
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
                <div className="room-info-box">
                  <p><b>Tipo:</b> {selectedRoomInfo.type}</p>
                  <p><b>Precio por noche:</b> ${selectedRoomInfo.pricePerNight}</p>
                  <p><b>Descripción:</b> {selectedRoomInfo.description}</p>
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

          <UserProfileModal
            visible={profileVisible}
            onClose={() => setProfileVisible(false)}
            user={user}
          />
        </Content>
      </Layout>
    </Layout>
  );
};
