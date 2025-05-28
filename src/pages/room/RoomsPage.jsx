// src/pages/room/RoomsPage.jsx
import React, { useState, useEffect } from "react";
import {
  Layout, Typography, Button, Avatar, Spin, message,
  Modal, Form, Input, Select, InputNumber, Row, Col
} from "antd";
import {
  UserOutlined, StarOutlined, EditOutlined,
  PlusOutlined, SearchOutlined
} from "@ant-design/icons";
import { Sidebar } from "../../components/sidebar/Sidebar";
import { UserProfileModal } from "../../components/UserProfileModal";
import SpotlightCard from "../../components/card/SpotlightCard";
import { useMyHotels } from "../../shared/hooks/useMyHotels";
import {
  getRoomsByHotel,
  createRoom,
  updateRoom,      
} from "../../services/api";

const { Header, Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

export const RoomsPage = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const {
    hotels,
    isLoading: loadingHotels,
  } = useMyHotels();

  const [selectedHotel, setSelectedHotel] = useState(null);
  const [rooms, setRooms]               = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(false);

  const [editingRoomId, setEditingRoomId] = useState(null);
  const [isSubmitting, setIsSubmitting]   = useState(false);

  const [modalVisible, setModalVisible]       = useState(false);
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (hotels.length && selectedHotel === null) {
      setSelectedHotel(hotels[0]._id);
    }
  }, [hotels, selectedHotel]);

  useEffect(() => {
    if (!selectedHotel) return;
    setLoadingRooms(true);
    getRoomsByHotel(selectedHotel)
      .then(res => {
        if (!res.error) setRooms(res.data.rooms || []);
        else message.error("Error al obtener habitaciones");
      })
      .catch(() => message.error("Error de conexión al cargar habitaciones"))
      .finally(() => setLoadingRooms(false));
  }, [selectedHotel]);

  const handleFinishRoom = async (values) => {
    setIsSubmitting(true);
    try {
      const roomData = {
        ...values,
        hotel: values.hotel || selectedHotel
      };
      let res;
      if (editingRoomId) {
        res = await updateRoom(editingRoomId, roomData);
      } else {
        res = await createRoom(roomData);
      }
      if (!res.error) {
        const newRoom = res.data.room;
        message.success(editingRoomId ? "Habitación actualizada" : "Habitación creada");
        setRooms(prev => {
          if (editingRoomId) {
            return prev.map(r => r._id === editingRoomId ? newRoom : r);
          }
          return [...prev, newRoom];
        });
        form.resetFields();
        setFormModalVisible(false);
        setEditingRoomId(null);
      } else {
        message.error(res.e?.response?.data?.msg || "Error al guardar habitación");
      }
    } catch {
      message.error("Error inesperado al procesar habitación");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openCreateModal = () => {
    setEditingRoomId(null);
    form.resetFields();
    form.setFieldsValue({ hotel: selectedHotel });
    setFormModalVisible(true);
  };

  const openEditModal = (room) => {
    setEditingRoomId(room._id);
    form.setFieldsValue({
      hotel: room.hotel,
      number: room.number,
      type: room.type,
      capacity: room.capacity,
      pricePerNight: room.pricePerNight,
      description: room.description,
    });
    setFormModalVisible(true);
  };

  const renderRoomIcons = (type) => {
    const icon = <UserOutlined style={{ fontSize: 40, marginRight: 4, color: "white" }} />;
    if (type === "SENCILLA") return icon;
    if (type === "DOBLE") return <>{icon}{icon}</>;
    if (type === "FAMILIAR") return <>{icon}{icon}{icon}{icon}</>;
    if (type === "SUITE") return <StarOutlined style={{ fontSize: 40, color: "white" }} />;
    return null;
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout style={{ marginLeft: 250 }}>
        <Header style={{
          background: "#fff", padding: "0 24px",
          display: "flex", justifyContent: "space-between",
          alignItems: "center", boxShadow: "0 2px 8px #f0f1f2"
        }}>
          <Title level={3} style={{ margin: 0 }}>Habitaciones</Title>
          <Button type="text" onClick={() => setModalVisible(true)}>
            <Avatar icon={<UserOutlined />} size="small" style={{ backgroundColor: "#1890ff", marginRight: 8 }} />
            {user.username}
          </Button>
        </Header>
        <Content style={{ padding: 20, background: "#f0f2f5" }}>
          {loadingHotels ? (
            <Spin tip="Cargando hoteles..." style={{ display: "block", margin: "40px auto" }} />
          ) : (
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
              <Select
                style={{ width: 300 }}
                placeholder={<><SearchOutlined /> Filtrar por hotel</>}
                value={selectedHotel}
                onChange={setSelectedHotel}
              >
                {hotels.map(h => (
                  <Option key={h._id} value={h._id}>{h.name}</Option>
                ))}
              </Select>
            </div>
          )}

          {loadingRooms ? (
            <Spin tip="Cargando habitaciones..." style={{ display: "block", margin: "40px auto" }} />
          ) : (
            <Row gutter={[16,16]} style={{ marginTop: 20 }}>
              <Col span={4}>
                <div onClick={openCreateModal} style={{ cursor: "pointer" }}>
                  <SpotlightCard spotlightColor="rgba(0, 123, 255, 0.3)">
                    <div style={{
                      height: 270, display: "flex", alignItems: "center",
                      justifyContent: "center", color: "white"
                    }}>
                      <PlusOutlined style={{ fontSize: 84 }} />
                    </div>
                  </SpotlightCard>
                </div>
              </Col>
              {rooms.map(room => (
                <Col span={4} key={room._id}>
                  <SpotlightCard spotlightColor="rgba(255,255,255,0.35)">
                    <div style={{ padding: 16, borderRadius: 12, color: "white" }}>
                      <Title level={4} style={{ color: "white" }}>
                        Habitación {room.number}
                      </Title>
                      <p><b>Tipo:</b> {room.type}</p>
                      <p><b>Capacidad:</b> {room.capacity}</p>
                      <p><b>Precio:</b> ${room.pricePerNight}</p>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        {renderRoomIcons(room.type)}
                      </div>
                      <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => openEditModal(room)}
                      />
                    </div>
                  </SpotlightCard>
                </Col>
              ))}
            </Row>
          )}
        </Content>
      </Layout>

      <UserProfileModal visible={modalVisible} onClose={() => setModalVisible(false)} user={user} />

      <Modal
        title={editingRoomId ? "Editar Habitación" : "Crear Nueva Habitación"}
        visible={formModalVisible}
        onCancel={() => { form.resetFields(); setFormModalVisible(false); setEditingRoomId(null); }}
        footer={null}
        width={700}
      >
        <Form form={form} onFinish={handleFinishRoom} layout="vertical">
          <Form.Item name="hotel" label="Seleccionar Hotel">
            <Select placeholder="Selecciona un hotel">
              {hotels.map(h => (
                <Option key={h._id} value={h._id}>{h.name}</Option>
              ))}
            </Select>
          </Form.Item>
          {/* resto de campos igual */}
          <Form.Item name="number" label="Número de habitación">
            <Input />
          </Form.Item>
          <Form.Item name="type" label="Tipo de habitación">
            <Select>
              <Option value="SENCILLA">Sencilla</Option>
              <Option value="DOBLE">Doble</Option>
              <Option value="SUITE">Suite</Option>
              <Option value="FAMILIAR">Familiar</Option>
            </Select>
          </Form.Item>
          <Form.Item name="capacity" label="Capacidad">
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="pricePerNight" label="Precio por noche">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="description" label="Descripción">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isSubmitting}>
              {editingRoomId ? "Guardar cambios" : "Crear habitación"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};
