import { useState, useEffect } from "react";
import { Menu } from "antd";
import {
  HomeOutlined,
  SearchOutlined,
  BookOutlined,
  UserOutlined,
  LogoutOutlined,
  DashboardOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  ApartmentOutlined,
  CalendarOutlined,
  FileTextOutlined,
  UsergroupAddOutlined,
  PieChartOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../../shared/context/DarkModeContext.jsx";

const menuItemsByRole = {
  CLIENT: [
    { key: "dashboard", label: "Inicio", icon: <HomeOutlined /> },
    { key: "hotels", label: "Buscar Hoteles", icon: <SearchOutlined /> },
    { key: "reservations", label: "Mis Reservaciones", icon: <BookOutlined /> },
    { key: "account", label: "Mi Cuenta", icon: <UserOutlined /> },
    { key: "logout", label: "Cerrar sesión", icon: <LogoutOutlined /> },
  ],
  HOTEL_ADMIN: [
    { key: "dashboard", label: "Dashboard", icon: <DashboardOutlined /> },
    { key: "reservations", label: "Reservaciones", icon: <BookOutlined /> },
    { key: "guests", label: "Huéspedes", icon: <TeamOutlined /> },
    { key: "availability", label: "Disponibilidad", icon: <CheckCircleOutlined /> },
    { key: "rooms", label: "Habitaciones", icon: <ApartmentOutlined /> },
    { key: "events", label: "Eventos", icon: <CalendarOutlined /> },
    { key: "billing", label: "Facturación", icon: <FileTextOutlined /> },
    { key: "logout", label: "Cerrar sesión", icon: <LogoutOutlined /> },
  ],
  PLATFORM_ADMIN: [
    { key: "dashboard", label: "Dashboard", icon: <DashboardOutlined /> },
    { key: "users", label: "Usuarios", icon: <UsergroupAddOutlined /> },
    { key: "hotels", label: "Hoteles", icon: <ApartmentOutlined /> },
        { key: "rooms", label: "Habitaciones", icon: <ApartmentOutlined /> },
    { key: "events", label: "Eventos", icon: <CalendarOutlined /> },
    { key: "reports", label: "Estadísticas / Reportes", icon: <PieChartOutlined /> },
    { key: "security", label: "Seguridad / Configuración", icon: <SettingOutlined /> },
    { key: "logout", label: "Cerrar sesión", icon: <LogoutOutlined /> },
  ],
};

export const Sidebar = () => {
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const { role: userRole } = JSON.parse(storedUser);
      setRole(userRole);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const onMenuClick = ({ key }) => {
    if (key === "logout") {
      handleLogout();
      return;
    }

    switch (key) {
      case "dashboard":
        navigate("/dashboard");
        break;
      case "hotels":
        navigate("/hotels");
        break;
      case "reservations":
        navigate("/reservations");
        break;
      case "account":
        navigate("/account");
        break;
      case "users":
        navigate("/users");
        break;
      case "guests":
        navigate("/guests");
        break;
      case "availability":
        navigate("/availability");
        break;
      case "rooms":
        navigate("/rooms");
        break;
      case "events":
        navigate("/events");
        break;
      case "billing":
        navigate("/billing");
        break;
      case "reports":
        navigate("/reports");
        break;
      case "security":
        navigate("/security");
        break;
      default:
        break;
    }
  };

  if (!role) return null;

  return (
    <div
      style={{
        width: 250,
        background: darkMode ? "#001529" : "#fff",
        height: "100vh",
        color: darkMode ? "#fff" : "#000",
        position: "fixed",
        top: 0,
        left: 0,
        paddingTop: 64,
        boxSizing: "border-box",
        zIndex: 1000,
        borderRight: darkMode ? "1px solid #444" : "1px solid #ddd",
      }}
    >
      <Menu
        theme={darkMode ? "dark" : "light"}
        mode="inline"
        defaultSelectedKeys={["dashboard"]}
        onClick={onMenuClick}
        items={menuItemsByRole[role]}
      />
    </div>
  );
};
