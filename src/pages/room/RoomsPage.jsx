import React, { useState, useEffect } from "react";
import {
  Layout, Typography, Button, Avatar, Spin, message, Modal, Form, Input, Select, InputNumber, Row, Col
} from "antd";
import { UserOutlined, StarOutlined, EditOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Sidebar } from "../../components/sidebar/Sidebar";
import { UserProfileModal } from "../../components/UserProfileModal";
import SpotlightCard from "../../components/card/SpotlightCard";
import { getRoomsByHotel, createRoom, getHotels } from "../../services/api";

const { Header, Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

export const RoomsPage = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [modalVisible, setModalVisible] = useState(false);
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [hotels, setHotels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [loadingHotels, setLoadingHotels] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await getHotels();
        if (!res.error) setHotels(res.data.hotels);
        else message.error("Error al cargar los hoteles");
      } catch (err) {
        message.error("Error de conexión al cargar hoteles");
      } finally {
        setLoadingHotels(false);
      }
    };
    fetchHotels();
  }, []);

  const handleHotelChange = async (hotelId) => {
    setSelectedHotel(hotelId);
    setRooms([]);
    if (!hotelId) return;
    setLoadingRooms(true);
    try {
      const response = await getRoomsByHotel(hotelId);
      if (!response.error) setRooms(response.data.rooms);
      else message.error("Error al obtener habitaciones del hotel");
    } catch {
      message.error("Error de conexión al cargar habitaciones");
    } finally {
      setLoadingRooms(false);
    }
  };

  const handleFinishRoom = async (values) => {
  console.log("📤 Valores enviados al backend:", values); // <= este log te dice qué estás mandando
  setIsSubmitting(true);
  try {
    const roomData = {
      ...values,
      hotel: values.hotel || selectedHotel
    };
    const response = await createRoom(roomData);
    if (!response.error) {
      message.success("Habitación creada");
      if (selectedHotel === roomData.hotel) {
        setRooms((prev) => [...prev, response.data.room]);
      }
      form.resetFields();
      setFormModalVisible(false);
    } else {
      message.error(response.e?.response?.data?.msg || "Error al crear habitación");
    }
  } catch {
    message.error("Error inesperado al crear habitación");
  } finally {
    setIsSubmitting(false);
  }
};


  const renderRoomIcons = (type) => {
    const icon = <UserOutlined style={{ fontSize: "40px", marginRight: 4, color: "white" }} />;
    if (type === "SENCILLA") return icon;
    if (type === "DOBLE") return <>{icon}{icon}</>;
    if (type === "FAMILIAR") return <>{icon}{icon}{icon}{icon}</>;
    if (type === "SUITE") return <StarOutlined style={{ fontSize: "40px", color: "white" }} />;
    return null;
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout style={{ marginLeft: 250 }}>
        <Header style={{
          background: "#fff", padding: "0 24px", display: "flex",
          justifyContent: "space-between", alignItems: "center", boxShadow: "0 2px 8px #f0f1f2"
        }}>
          <Title level={3} style={{ margin: 0 }}>Habitaciones</Title>
          <Button type="text" onClick={() => setModalVisible(true)} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Avatar icon={<UserOutlined />} size="small" style={{ backgroundColor: "#1890ff" }} />
            <span>{user?.username || "Usuario"}</span>
          </Button>
        </Header>

        <Content style={{ padding: 20, background: "#f0f2f5" }}>
          {loadingHotels ? (
            <Spin tip="Cargando hoteles..." size="large" style={{ display: "block", margin: "40px auto" }} />
          ) : (
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
              <Select
                style={{ width: 300 }}
                placeholder={<span><SearchOutlined /> Filtrar por hotel</span>}
                onChange={handleHotelChange}
                allowClear
                value={selectedHotel}
              >
                {hotels.map(hotel => (
                  <Option key={hotel._id} value={hotel._id}>{hotel.name}</Option>
                ))}
              </Select>
            </div>
          )}

          {loadingRooms ? (
            <Spin tip="Cargando habitaciones..." size="large" style={{ display: "block", margin: "40px auto" }} />
          ) : (
            <>
              {rooms.length === 0 && selectedHotel && (
                <Title level={4} style={{ color: "black" }}>
                  No hay habitaciones para este hotel.
                </Title>
              )}
              <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
                <Col span={8}>
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      form.resetFields();
                      form.setFieldsValue({
                        hotel: selectedHotel || undefined,
                        number: "",
                        type: "",
                        capacity: null,
                        pricePerNight: null,
                        description: ""
                      });
                      setFormModalVisible(true);
                    }}
                  >
                    <SpotlightCard spotlightColor="rgba(0, 123, 255, 0.3)">
                      <div
                        style={{
                          height: 270,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "column",
                          color: "white"
                        }}
                      >
                        <PlusOutlined style={{ fontSize: "84px" }} />
                      </div>
                    </SpotlightCard>
                  </div>
                </Col>
                {rooms.map((room) => (
                  <Col span={8} key={room._id}>
                    <SpotlightCard spotlightColor="rgba(255, 255, 255, 0.35)">
                      <div style={{ padding: 16, borderRadius: 12, color: "white" }}>
                        <Title level={4} style={{ color: "white" }}>Habitación {room.number}</Title>
                        <p><b>Tipo:</b> {room.type}</p>
                        <p><b>Capacidad:</b> {room.capacity}</p>
                        <p><b>Precio por noche:</b> ${room.pricePerNight}</p>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          {renderRoomIcons(room.type)}
                        </div>
                        <Button type="link" icon={<EditOutlined />} onClick={() => {
                          form.setFieldsValue(room);
                          setFormModalVisible(true);
                        }} />
                      </div>
                    </SpotlightCard>
                  </Col>
                ))}
              </Row>
            </>
          )}
        </Content>
      </Layout>

      <UserProfileModal visible={modalVisible} onClose={() => setModalVisible(false)} user={user} />

        <Modal
          title="Crear Nueva Habitación"
          visible={formModalVisible}
          onCancel={() => {
            form.resetFields();
            setFormModalVisible(false);
          }}
          footer={null}
          width={700}
        >
          <Form
            form={form}
            onFinish={handleFinishRoom}
            layout="vertical"
          >
            <Form.Item name="hotel" label="Seleccionar Hotel" rules={[{ required: false }]}>
              <Select placeholder="Selecciona un hotel">
                {hotels.map(hotel => (
                  <Option key={hotel._id} value={hotel._id}>{hotel.name}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="number" label="Número de habitación" rules={[{ required: false }]}>
              <Input />
            </Form.Item>

            <Form.Item name="type" label="Tipo de habitación" rules={[{ required: false }]}>
              <Select>
                <Option value="SENCILLA">Sencilla</Option>
                <Option value="DOBLE">Doble</Option>
                <Option value="SUITE">Suite</Option>
                <Option value="FAMILIAR">Familiar</Option>
              </Select>
            </Form.Item>

            <Form.Item name="capacity" label="Capacidad" rules={[{ required: false }]}>
              <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item name="pricePerNight" label="Precio por noche" rules={[{ required: false }]}>
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item name="description" label="Descripción">
              <Input.TextArea rows={3} />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={isSubmitting}>
                Crear Habitación
              </Button>
            </Form.Item>
          </Form>
        </Modal>
    </Layout>
  );
};
