import React, { useEffect } from "react";
import {
  Form,
  Input,
  Select,
  Checkbox,
  Button,
  message,
  Card,
  Typography,
  Spin,
} from "antd";
import { createHotel, updateHotel } from "../../services/api";
import { useAdmins } from "../../shared/hooks/useAdmins";

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const amenitiesOptions = [
  "WIFI",
  "PISCINA",
  "RESTAURANTE",
  "GYM",
  "SPA",
  "ESTACIONAMIENTO",
  "SERVICIO_HABITACION",
];

const categoryOptions = [
  "ECONOMICO",
  "FAMILIAR",
  "NEGOCIOS",
  "RESORT",
  "LUJO",
];

export const HotelsManager = ({ hotel, onAdded }) => {
  const [form] = Form.useForm();
  const { admins, loading, error } = useAdmins();

  useEffect(() => {
    if (hotel) {
      form.setFieldsValue({
        name: hotel.name,
        address: hotel.address,
        description: hotel.description,
        category: hotel.category,
        amenities: hotel.amenities,
        admin: hotel.admin?.uid || hotel.admin || undefined,
      });
    } else {
      form.resetFields();
    }
  }, [hotel]);

  const onFinish = async (values) => {
    try {
      const payload = {
        ...values,
        amenities: values.amenities ? values.amenities.map((a) => a.toUpperCase()) : [],
        category: values.category.toUpperCase(),
        admin: values.admin,
      };

      let res;
      if (hotel) {
        // Editar hotel existente
        res = await updateHotel(hotel._id, payload);
      } else {
        // Crear hotel nuevo
        res = await createHotel(payload);
      }

      if (res.error) throw res.e;

      message.success(hotel ? "Hotel actualizado correctamente" : "Hotel agregado correctamente");
      form.resetFields();
      if (onAdded) onAdded();
    } catch (error) {
      message.error(error.response?.data?.msg || "Error al guardar hotel");
    }
  };

  return (
    <Card
      style={{
        maxWidth: 700,
        margin: "auto",
        padding: 24,
        borderRadius: 12,
        boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
      }}
    >
      <Title level={3} style={{ textAlign: "center", marginBottom: 24, color: "#1890ff" }}>
        {hotel ? "Editar Hotel" : "Agregar Nuevo Hotel"}
      </Title>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Nombre"
          name="name"
          rules={[{ required: true, message: "Por favor ingresa el nombre del hotel" }]}
        >
          <Input placeholder="Nombre del hotel" />
        </Form.Item>

        <Form.Item
          label="Dirección"
          name="address"
          rules={[{ required: true, message: "Por favor ingresa la dirección" }]}
        >
          <Input placeholder="Dirección del hotel" />
        </Form.Item>

        <Form.Item
          label="Descripción"
          name="description"
          rules={[
            { required: true, message: "Por favor ingresa la descripción" },
            { max: 500, message: "La descripción no puede exceder 500 caracteres" },
          ]}
        >
          <TextArea rows={4} placeholder="Descripción del hotel" />
        </Form.Item>

        <Form.Item
          label="Categoría"
          name="category"
          rules={[{ required: true, message: "Por favor selecciona la categoría" }]}
        >
          <Select placeholder="Selecciona una categoría">
            {categoryOptions.map((cat) => (
              <Option key={cat} value={cat}>
                {cat}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Encargado"
          name="admin"
          rules={[{ required: true, message: "Por favor selecciona un encargado" }]}
        >
          {loading ? (
            <Spin />
          ) : error ? (
            <p>Error cargando encargados</p>
          ) : (
            <Select placeholder="Selecciona un encargado" allowClear>
              {admins
                .filter((admin) => admin.uid != null)
                .map((admin) => (
                  <Option key={admin.uid} value={admin.uid}>
                    {admin.name || admin.username || admin.email}
                  </Option>
                ))}
            </Select>
          )}
        </Form.Item>

        <Form.Item label="Servicios" name="amenities">
          <Checkbox.Group options={amenitiesOptions} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            {hotel ? "Guardar Cambios" : "Agregar Hotel"}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
