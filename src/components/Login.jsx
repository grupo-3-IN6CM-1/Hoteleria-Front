import { useState } from "react";
import { useLogin } from '../shared/hooks/useLogin';
import {
  emailValidationMessage,
  validateEmail,
  validatePasswordMessage,
  validatePassword
} from '../shared/validators';
import { motion } from "framer-motion";
import { Form, Input, Button, Typography, Space, Divider, Switch } from 'antd';
import { BulbOutlined, BulbFilled } from "@ant-design/icons";
import { useDarkMode } from "../shared/context/DarkModeContext"; 

const { Title, Text, Link } = Typography;

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.1,
      duration: 0.5,
      ease: "easeOut"
    }
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export const Login = ({ switchAuthHandler }) => {
  const { login, isLoading } = useLogin();
  const { darkMode, toggleDarkMode } = useDarkMode();

  const [formState, setFormState] = useState({
    email: { value: "", isValid: false, showError: false },
    password: { value: "", isValid: false, showError: false },
  });

  const handleInputValueChange = (value, field) => {
    setFormState((prev) => ({ ...prev, [field]: { ...prev[field], value } }));
  };

  const handleInputValidationOnBlur = (value, field) => {
    const isValid = field === "email" ? validateEmail(value) : validatePassword(value);
    setFormState((prev) => ({
      ...prev,
      [field]: { ...prev[field], isValid, showError: !isValid },
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formState.email.isValid || !formState.password.isValid) return;
    try {
      await login(formState.email.value, formState.password.value);
    } catch {}
  };

  const isSubmitButtonDisable =
    isLoading || !formState.email.isValid || !formState.password.isValid;

  const backgroundColor = darkMode ? "#0e0e0e" : "#ffffff";
  const cardColor = darkMode ? "#1e1e1e" : "#fff";
  const textColor = darkMode ? "#eaeaea" : "#1d1f27";
  const secondaryColor = darkMode ? "#aaa" : "#595959";
  const linkColor = darkMode ? "#8a63d2" : "#6a11cb";
  const borderColor = darkMode ? "#444" : "#ccc";

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "24px",
        backgroundColor: backgroundColor,
        transition: "background-color 0.3s ease"
      }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          width: "100%",
          maxWidth: 420,
          backgroundColor: cardColor,
          borderRadius: 12,
          boxShadow: "0 12px 24px rgba(0,0,0,0.3)",
          padding: "40px 32px",
          boxSizing: "border-box",
        }}
        aria-label="Login form container"
      >
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
          <Switch
            checked={darkMode}
            onChange={toggleDarkMode}
            checkedChildren={<BulbFilled />}
            unCheckedChildren={<BulbOutlined />}
          />
        </div>

        <motion.div variants={itemVariants}>
          <Title level={2} style={{ textAlign: "center", marginBottom: 8, color: textColor }}>
            Welcome back
          </Title>
          <Text style={{ display: "block", textAlign: "center", marginBottom: 32, color: secondaryColor }}>
            Please enter your details to login
          </Text>
        </motion.div>

        <Form layout="vertical" onSubmitCapture={handleLogin} noValidate>
          <motion.div variants={itemVariants}>
            <Form.Item
              label={<span style={{ color: textColor }}>Email</span>}
              required
              validateStatus={formState.email.showError ? "error" : ""}
              help={formState.email.showError ? emailValidationMessage : ""}
              hasFeedback
            >
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formState.email.value}
                onChange={(e) => handleInputValueChange(e.target.value, "email")}
                onBlur={(e) => handleInputValidationOnBlur(e.target.value, "email")}
                disabled={isLoading}
                autoComplete="username"
              />
            </Form.Item>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Form.Item
              label={<span style={{ color: textColor }}>Password</span>}
              required
              validateStatus={formState.password.showError ? "error" : ""}
              help={formState.password.showError ? validatePasswordMessage : ""}
              hasFeedback
            >
              <Input.Password
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formState.password.value}
                onChange={(e) => handleInputValueChange(e.target.value, "password")}
                onBlur={(e) => handleInputValidationOnBlur(e.target.value, "password")}
                disabled={isLoading}
                autoComplete="current-password"
              />
            </Form.Item>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                loading={isLoading}
                disabled={isSubmitButtonDisable}
                style={{
                  fontWeight: "600",
                  backgroundColor: darkMode ? "#722ed1" : undefined,
                  borderColor: darkMode ? "#722ed1" : undefined
                }}
              >
                Log in
              </Button>
            </Form.Item>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Form.Item style={{ textAlign: "center", marginBottom: 16 }}>
              <Link href="#" style={{ color: linkColor }}>
                Forgot password?
              </Link>
            </Form.Item>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Divider style={{ borderColor }} />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Space
              direction="vertical"
              size={4}
              style={{ width: "100%", textAlign: "center" }}
            >
              <Text style={{ fontWeight: "500", color: secondaryColor }}>
                Don’t have an account?
              </Text>
              <Button
                type="default"
                onClick={switchAuthHandler}
                block
                size="large"
                style={{
                  fontWeight: "600",
                  backgroundColor: darkMode ? "#2f2f2f" : "#f0f0f0",
                  color: darkMode ? "#eaeaea" : "#000",
                  borderColor: darkMode ? "#555" : "#d9d9d9",
                }}
              >
                Registrate
              </Button>
            </Space>
          </motion.div>
        </Form>
      </motion.div>
    </div>
  );
};