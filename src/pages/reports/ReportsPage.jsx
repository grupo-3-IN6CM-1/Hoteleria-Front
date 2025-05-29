import React, { useEffect, useState } from "react";
import { Layout, Button, Avatar, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Sidebar } from "../../components/sidebar/Sidebar";
import { UserProfileModal } from "../../components/UserProfileModal";
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { TrendingUp } from "lucide-react";
import { useCharts } from "../../shared/hooks/useCharts";
import "./ReportsPage.css";

const { Header, Content } = Layout;
const { Title } = Typography;

export const ReportsPage = () => {
  const [user, setUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { topRooms, topHotels, loading, error } = useCharts();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const renderChart = (title, data, labelKey) => (
    <div className="chart-container">
      <h2 className="chart-title">{title}</h2>
      <BarChart
        width={600}
        height={300}
        data={data}
        layout="vertical"
        margin={{ top: 20, right: 30, left: 60, bottom: 5 }}
      >
        <XAxis type="number" tick={{ fill: "#fff" }} />
        <YAxis
          type="category"
          dataKey={labelKey}
          tick={{ fill: "#fff" }}
          width={120}
        />
        <Tooltip
          contentStyle={{ backgroundColor: "#111", border: "none" }}
          labelStyle={{ color: "#fff" }}
          cursor={{ fill: "rgba(255,255,255,0.1)" }}
        />
        <Bar dataKey="count" fill="hsl(359, 2%, 90%)" radius={5} />
      </BarChart>
      <div className="chart-trend">
        <span>+2.2% este mes</span>
        <TrendingUp size={16} />
      </div>
      <p className="chart-footnote">
        Total de solicitudes por {labelKey === "roomType" ? "tipo de habitación" : "hotel"}
      </p>
    </div>
  );

  return (
    <Layout className="reports-layout">
      <Sidebar />
      <Layout className="reports-inner-layout">
        <Header className="reports-header">
          <Title level={3} className="reports-title">
            Reportes
          </Title>
          <Button
            type="text"
            onClick={() => setModalVisible(true)}
            className="reports-user-button"
          >
            <Avatar
              icon={<UserOutlined />}
              size="small"
              style={{ backgroundColor: "#1890ff" }}
            />
            <span>{user?.username || "Usuario"}</span>
          </Button>
        </Header>

        <Content className="reports-content">
          {loading ? (
            <p style={{ color: "#fff" }}>Cargando gráficas...</p>
          ) : error ? (
            <p style={{ color: "#f00" }}>Error al cargar datos</p>
          ) : (
            <div style={{ display: "flex", gap: "32px", flexWrap: "wrap", justifyContent: "center" }}>
                {renderChart("Habitaciones más cotizadas", topRooms, "roomType")}
                {renderChart("Hoteles más reservados", topHotels, "name")}
            </div>
          )}
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
