function isFormValid({ name, email, password }) {
  let isNameValid;
  if (name) isNameValid = /^[a-zA-Z0-9_. ]{2,20}$/.test(name);
  const isPasswordValid = /^[a-zA-Z0-9./!@#$%^&*]+$/.test(password);
  const isEmailValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
    email
  );

  const result = { isValid: true, message: "Form is Valid!" };

  if (name && !isNameValid) {
    result.isValid = false;

    if (name.trim().length === 0) {
      result.message = "Name is Required!";
    } else if (name.length <= 2) {
      result.message = "Name is too Short!";
    } else if (name.length >= 20) {
      result.message = "Name is too Long!";
    } else {
      result.message = "Invalid Name!";
    }
  } else if (!isEmailValid) {
    result.isValid = false;

    if (email.trim().length === 0) {
      result.message = "Email is Required!";
    } else {
      result.message = "Invalid Email!";
    }
  } else if (!isPasswordValid) {
    result.isValid = false;

    if (password.length === 0) {
      result.message = "Password is Required!";
    } else {
      result.message = "Invalid Characters in Password!";
    }
  }

  return result;
}

export { isFormValid };
