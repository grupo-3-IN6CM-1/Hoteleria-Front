import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  validatePassword,
  validateConfirPassword,
  emailValidationMessage,
  validatePasswordMessage,
  passwordConfirmationMessage
} from "../shared/validators";
import {
  isValidEmail,
  isValidUsername,
  validateExistEmailMessage,
  validateExistUsernameMessage
} from "../shared/validators/auth/authValidator.jsx";
import { Form, Input, Button, Typography, Row, Col, Alert, Switch } from "antd";
import { motion } from "framer-motion";
import { BulbOutlined, BulbFilled } from "@ant-design/icons";
import { useDarkMode } from "../shared/context/DarkModeContext";

const { Title, Text } = Typography;

const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export const Register = ({ switchAuthHandler }) => {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useDarkMode();

  const [formState, setFormState] = useState({
    email: { value: "", isValid: false, showError: false },
    username: { value: "", isValid: false, showError: false },
    name: { value: "", isValid: false, showError: false },
    surname: { value: "", isValid: false, showError: false },
    password: { value: "", isValid: false, showError: false },
    passwordConfir: { value: "", isValid: false, showError: false },
    successMessage: "",
    errorMessage: "",
    emailExists: false,
    usernameExists: false,
  });

  const handleInputValueChange = (value, field) => {
    setFormState((prev) => ({
      ...prev,
      [field]: { ...prev[field], value }
    }));

    if (field === "email") {
      const isValid = isValidEmail(value);
      setFormState((prev) => ({
        ...prev,
        email: { ...prev.email, isValid, showError: !isValid }
      }));
    } else if (field === "username") {
      const isValid = isValidUsername(value);
      setFormState((prev) => ({
        ...prev,
        username: { ...prev.username, isValid, showError: !isValid }
      }));
    }
  };

  const handleInputValidationOnBlur = (value, field) => {
    let isValid = false;
    switch (field) {
      case "email":
        isValid = isValidEmail(value);
        break;
      case "username":
        isValid = isValidUsername(value);
        break;
      case "name":
      case "surname":
        isValid = value.trim().length > 0;
        break;
      case "password":
        isValid = validatePassword(value);
        break;
      case "passwordConfir":
        isValid = validateConfirPassword(formState.password.value, value);
        break;
      default:
        break;
    }
    setFormState((prev) => ({
      ...prev,
      [field]: { ...prev[field], isValid, showError: !isValid }
    }));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const userData = {
      name: formState.name.value,
      surname: formState.surname.value,
      username: formState.username.value,
      email: formState.email.value,
      password: formState.password.value
    };

    fetch("http://localhost:3000/Hoteleria/v1/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData)
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setFormState((prev) => ({
            ...prev,
            successMessage: "¡Registro exitoso!",
            errorMessage: ""
          }));
          setTimeout(() => navigate("/"), 2000);
        } else {
          setFormState((prev) => ({
            ...prev,
            successMessage: "",
            errorMessage: data.msg || "Hubo un error al registrar el usuario."
          }));
        }
      })
      .catch(() => {
        setFormState((prev) => ({
          ...prev,
          successMessage: "",
          errorMessage: "Error en la conexión. Intenta nuevamente."
        }));
      });
  };

  const isDisabled =
    !Object.values(formState).every(
      (f) => typeof f !== "string" ? f.isValid !== false : true
    ) || formState.usernameExists || formState.emailExists;

  const colors = {
    bg: darkMode ? "#0e0e0e" : "#f0f2f5",
    card: darkMode ? "#1e1e1e" : "#fff",
    text: darkMode ? "#eaeaea" : "#1d1f27",
    secondary: darkMode ? "#aaa" : "#595959",
    border: darkMode ? "#444" : "#ccc"
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: colors.bg,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 24
      }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          width: "100%",
          maxWidth: 900,
          backgroundColor: colors.card,
          borderRadius: 12,
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "row"
        }}
      >
        <motion.div
          variants={itemVariants}
          style={{
            flex: 1,
            background: "linear-gradient(135deg, #ff6ec4 0%, #7873f5 100%)",
            color: "#fff",
            padding: "48px 32px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            gap: 16,
            position: "relative"
          }}
        >
          <div style={{ position: "absolute", top: 16, right: 16 }}>
            <Switch
              checked={darkMode}
              onChange={toggleDarkMode}
              checkedChildren={<BulbFilled />}
              unCheckedChildren={<BulbOutlined />}
            />
          </div>
          <Title style={{ color: "#fff" }}>Hola, Bienvenido!</Title>
          <Text style={{ color: "rgba(255, 255, 255, 0.85)" }}>
            Si ya tienes una cuenta puedes iniciar sesión aquí
          </Text>
          <Button
            type="default"
            onClick={switchAuthHandler}
            style={{ marginTop: 24, width: "180px" }}
            size="large"
          >
            Log in
          </Button>
        </motion.div>

        <motion.div
          variants={itemVariants}
          style={{
            flex: 1.2,
            padding: "48px 40px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
          }}
        >
          <Title level={3} style={{ marginBottom: 24, textAlign: "center", color: colors.text }}>
            Crea una cuenta
          </Title>

          <Form layout="vertical" onSubmitCapture={handleRegister} noValidate>
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label={<span style={{ color: colors.text }}>First Name</span>}
                  validateStatus={formState.name.showError ? "error" : ""}
                  help={formState.name.showError && "First name is required."}
                  required
                  hasFeedback
                >
                  <Input
                    placeholder="First Name"
                    value={formState.name.value}
                    onChange={(e) => handleInputValueChange(e.target.value, "name")}
                    onBlur={(e) => handleInputValidationOnBlur(e.target.value, "name")}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label={<span style={{ color: colors.text }}>Last Name</span>}
                  validateStatus={formState.surname.showError ? "error" : ""}
                  help={formState.surname.showError && "Last name is required."}
                  required
                  hasFeedback
                >
                  <Input
                    placeholder="Last Name"
                    value={formState.surname.value}
                    onChange={(e) => handleInputValueChange(e.target.value, "surname")}
                    onBlur={(e) => handleInputValidationOnBlur(e.target.value, "surname")}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label={<span style={{ color: colors.text }}>Username</span>}
              validateStatus={formState.username.showError || formState.usernameExists ? "error" : ""}
              help={
                (formState.username.showError &&
                  "Username is invalid (3-20 characters, alphanumeric or underscore).") ||
                (formState.usernameExists && validateExistUsernameMessage)
              }
              required
              hasFeedback
            >
              <Input
                placeholder="Username"
                value={formState.username.value}
                onChange={(e) => handleInputValueChange(e.target.value, "username")}
                onBlur={(e) => handleInputValidationOnBlur(e.target.value, "username")}
              />
            </Form.Item>

            <Form.Item
              label={<span style={{ color: colors.text }}>Email</span>}
              validateStatus={formState.email.showError || formState.emailExists ? "error" : ""}
              help={
                (formState.email.showError && emailValidationMessage) ||
                (formState.emailExists && validateExistEmailMessage)
              }
              required
              hasFeedback
            >
              <Input
                type="email"
                placeholder="Email"
                value={formState.email.value}
                onChange={(e) => handleInputValueChange(e.target.value, "email")}
                onBlur={(e) => handleInputValidationOnBlur(e.target.value, "email")}
              />
            </Form.Item>

            <Form.Item
              label={<span style={{ color: colors.text }}>Password</span>}
              validateStatus={formState.password.showError ? "error" : ""}
              help={formState.password.showError && validatePasswordMessage}
              required
              hasFeedback
            >
              <Input.Password
                placeholder="Password"
                value={formState.password.value}
                onChange={(e) => handleInputValueChange(e.target.value, "password")}
                onBlur={(e) => handleInputValidationOnBlur(e.target.value, "password")}
              />
            </Form.Item>

            <Form.Item
              label={<span style={{ color: colors.text }}>Confirm Password</span>}
              validateStatus={formState.passwordConfir.showError ? "error" : ""}
              help={formState.passwordConfir.showError && passwordConfirmationMessage}
              required
              hasFeedback
            >
              <Input.Password
                placeholder="Confirm Password"
                value={formState.passwordConfir.value}
                onChange={(e) => handleInputValueChange(e.target.value, "passwordConfir")}
                onBlur={(e) => handleInputValidationOnBlur(e.target.value, "passwordConfir")}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                disabled={isDisabled}
                style={{ fontWeight: "600" }}
              >
                Register
              </Button>
            </Form.Item>
          </Form>

          {formState.successMessage && (
            <Alert type="success" message={formState.successMessage} showIcon style={{ marginTop: 16 }} />
          )}
          {formState.errorMessage && (
            <Alert type="error" message={formState.errorMessage} showIcon style={{ marginTop: 16 }} />
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};