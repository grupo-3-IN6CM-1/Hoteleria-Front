export const isValidUsername = (username) => {
    const usernamePattern = /^[a-zA-Z0-9_]{3,20}$/; 
    return usernamePattern.test(username);
  };
  
export const validateExistEmailMessage = 'El correo ya existe en la base de datos'

export const isValidEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

export const validateExistUsernameMessage = 'El username ya existe en la base de datos'