import { useState } from "react";
import { useLogin } from '../shared/hooks/useLogin';
import {
    emailValidationMessage,
    validateEmail,
    validatePasswordMessage,
    validatePassword
} from '../shared/validators';

export const Login = ({ switchAuthHandler }) => {
    const { login, isLoading } = useLogin();
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
      try {
        await login(formState.email.value, formState.password.value);
      } catch {}
    };
  
    const isSubmitButtonDisable =
      isLoading || !formState.email.isValid || !formState.password.isValid;

    return (
        <div className="login-page-wrapper">
            <div className="login-header-image"></div>
            <div className="login-card">
                <h4 className="text-center mb-4">Welcome back</h4>
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            className={`form-control ${formState.email.showError ? 'is-invalid' : ''}`}
                            id="email"
                            value={formState.email.value}
                            onChange={(e) => handleInputValueChange(e.target.value, 'email')}
                            onBlur={(e) => handleInputValidationOnBlur(e.target.value, 'email')}
                            placeholder="Enter your email"
                        />
                        {formState.email.showError && (
                            <div className="invalid-feedback">{emailValidationMessage}</div>
                        )}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            className={`form-control ${formState.password.showError ? 'is-invalid' : ''}`}
                            id="password"
                            value={formState.password.value}
                            onChange={(e) => handleInputValueChange(e.target.value, 'password')}
                            onBlur={(e) => handleInputValidationOnBlur(e.target.value, 'password')}
                            placeholder="Enter your password"
                        />
                        {formState.password.showError && (
                            <div className="invalid-feedback">{validatePasswordMessage}</div>
                        )}
                    </div>

                    <div className="d-grid gap-2 mb-4">
                        <button
                            className="btn login-btn"
                            type="submit"
                            disabled={isSubmitButtonDisable}
                        >
                            {isLoading ? 'Logging in...' : 'Log in'}
                        </button>
                    </div>

                    <div className="text-center mb-3">
                        <a href="#" className="text-muted">Forgot password?</a>
                    </div>

                    <div className="text-center">
                        <p className="mb-2">Don't have an account?</p>
                        <button
                            type="button btn-outline-ligth"
                            onClick={switchAuthHandler}
                            className="btn register-btn"
                        >
                            Registrate
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
