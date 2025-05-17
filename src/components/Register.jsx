import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  validatePassword,
  validateConfirPassword,
  emailValidationMessage,
  validatePasswordMessage,
  passwordConfirmationMessage
} from "../shared/validators";
import { isValidEmail, isValidUsername, validateExistEmailMessage, validateExistUsernameMessage } from "../shared/validators/auth/authValidator.jsx";

export const Register = ({ switchAuthHandler }) => {
  const navigate = useNavigate();
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
    usernameExists: false
  });

  const handleInputValueChange = (value, field) => {
    setFormState(prev => ({
      ...prev,
      [field]: { ...prev[field], value }
    }));

    if (field === "email") {
      const isValid = isValidEmail(value);
      setFormState(prev => ({
        ...prev,
        email: { ...prev.email, isValid, showError: !isValid }
      }));
    } else if (field === "username") {
      const isValid = isValidUsername(value);
      setFormState(prev => ({
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
    setFormState(prev => ({
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
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setFormState(prev => ({ ...prev, successMessage: "Registration successful!", errorMessage: "" }));
          setTimeout(() => navigate("/"), 2000); // Redirige a la página de bienvenida
        } else {
          setFormState(prev => ({
            ...prev,
            successMessage: "",
            errorMessage: data.msg || "Hubo un error al registrar el usuario."
          }));
        }
      })
      .catch(error => {
        setFormState(prev => ({
          ...prev,
          successMessage: "",
          errorMessage: "Error en la conexión. Intenta nuevamente."
        }));
      });
  };

  const isDisabled = !Object.values(formState).every(
    f => typeof f !== "string" ? f.isValid !== false : true
  );

  return (
    <div className="register-page-wrapper">
      <div className="register-card">
        <div className="register-panel-left">
          <h2>Hola, Bienvenido!</h2>
          <p className="text-center">Si ya tienes una cuenta puedes inicar sesión aquí</p>
          <button className="btn btn-outline-light mt-3" onClick={switchAuthHandler}>Log in</button>
        </div>

        <div className="register-panel-right">
          <h3 className="text-center mb-4">Crea una cuenta</h3>
          <form onSubmit={handleRegister}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <input
                  type="text"
                  className={`form-control ${formState.name.showError ? "is-invalid" : ""}`}
                  placeholder="First Name"
                  value={formState.name.value}
                  onChange={(e) => handleInputValueChange(e.target.value, "name")}
                  onBlur={(e) => handleInputValidationOnBlur(e.target.value, "name")}
                />
                {formState.name.showError && <div className="invalid-feedback">First name is required.</div>}
              </div>
              <div className="col-md-6 mb-3">
                <input
                  type="text"
                  className={`form-control ${formState.surname.showError ? "is-invalid" : ""}`}
                  placeholder="Last Name"
                  value={formState.surname.value}
                  onChange={(e) => handleInputValueChange(e.target.value, "surname")}
                  onBlur={(e) => handleInputValidationOnBlur(e.target.value, "surname")}
                />
                {formState.surname.showError && <div className="invalid-feedback">Last name is required.</div>}
              </div>
            </div>

            <input
              type="text"
              className={`form-control mb-3 ${formState.username.showError || formState.usernameExists ? "is-invalid" : ""}`}
              placeholder="Username"
              value={formState.username.value}
              onChange={(e) => handleInputValueChange(e.target.value, "username")}
              onBlur={(e) => handleInputValidationOnBlur(e.target.value, "username")}
            />
            {formState.username.showError && <div className="invalid-feedback">Username is invalid (3-20 characters, alphanumeric or underscore).</div>}
            {formState.usernameExists && <div className="invalid-feedback">{validateExistUsernameMessage}</div>}

            <input
              type="email"
              className={`form-control mb-3 ${formState.email.showError || formState.emailExists ? "is-invalid" : ""}`}
              placeholder="Email"
              value={formState.email.value}
              onChange={(e) => handleInputValueChange(e.target.value, "email")}
              onBlur={(e) => handleInputValidationOnBlur(e.target.value, "email")}
            />
            {formState.email.showError && <div className="invalid-feedback">{emailValidationMessage}</div>}
            {formState.emailExists && <div className="invalid-feedback">{validateExistEmailMessage}</div>}

            <input
              type="password"
              className={`form-control mb-3 ${formState.password.showError ? "is-invalid" : ""}`}
              placeholder="Password"
              value={formState.password.value}
              onChange={(e) => handleInputValueChange(e.target.value, "password")}
              onBlur={(e) => handleInputValidationOnBlur(e.target.value, "password")}
            />
            {formState.password.showError && <div className="invalid-feedback">{validatePasswordMessage}</div>}

            <input
              type="password"
              className={`form-control mb-3 ${formState.passwordConfir.showError ? "is-invalid" : ""}`}
              placeholder="Confirm Password"
              value={formState.passwordConfir.value}
              onChange={(e) => handleInputValueChange(e.target.value, "passwordConfir")}
              onBlur={(e) => handleInputValidationOnBlur(e.target.value, "passwordConfir")}
            />
            {formState.passwordConfir.showError && <div className="invalid-feedback">{passwordConfirmationMessage}</div>}

            <div className="d-grid mt-4">
              <button type="submit" className="btn btn-primary" disabled={isDisabled || formState.usernameExists || formState.emailExists}>
                Register
              </button>
            </div>

            {formState.successMessage && (
              <div className="alert alert-success mt-3 text-center">
                {formState.successMessage}
              </div>
            )}

            {formState.errorMessage && (
              <div className="alert alert-danger mt-3 text-center">
                {formState.errorMessage}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};