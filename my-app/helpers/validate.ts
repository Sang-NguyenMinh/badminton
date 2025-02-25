type ValidationError = string;
type ValidationResult = ValidationError | null;

// Hàm validate email
export const validateEmail = (email: string): ValidationResult => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return "Email không được để trống";
  if (!emailRegex.test(email)) return "Email không hợp lệ";
  return null;
};

// Hàm validate số điện thoại (Việt Nam)
export const validatePhoneNumber = (phone: string): ValidationResult => {
  const phoneRegex = /^(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/;
  if (!phone) return "Số điện thoại không được để trống";
  if (!phoneRegex.test(phone)) return "Số điện thoại không hợp lệ";
  return null;
};

// Hàm validate mật khẩu
export const validatePassword = (password: string): ValidationResult => {
  if (!password) return "Mật khẩu không được để trống";
  if (password.length < 8) return "Mật khẩu phải có ít nhất 8 ký tự";
  if (!/[A-Z]/.test(password)) return "Mật khẩu phải chứa ít nhất một chữ hoa";
  if (!/[a-z]/.test(password)) return "Mật khẩu phải chứa ít nhất một chữ thường";
  if (!/[0-9]/.test(password)) return "Mật khẩu phải chứa ít nhất một số";
  if (!/[!@#$%^&*]/.test(password)) return "Mật khẩu phải chứa ít nhất một ký tự đặc biệt (!@#$%^&*)";
  return null;
};

// Hàm validate tên
export const validateName = (name: string): ValidationResult => {
  if (!name) return "Tên không được để trống";
  if (name.length < 2) return "Tên phải có ít nhất 2 ký tự";
  if (!/^[a-zA-Z\s]*$/.test(name)) return "Tên chỉ được chứa chữ cái và khoảng trắng";
  return null;
};

// Hàm validate tuổi
export const validateAge = (age: string): ValidationResult => {
  const ageNumber = parseInt(age, 10);
  if (!age) return "Tuổi không được để trống";
  if (isNaN(ageNumber)) return "Tuổi phải là số";
  if (ageNumber < 18 || ageNumber > 120) return "Tuổi phải từ 18 đến 120";
  return null;
};

// Hàm validate URL
export const validateUrl = (url: string): ValidationResult => {
  const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
  if (!url) return "URL không được để trống";
  if (!urlRegex.test(url)) return "URL không hợp lệ";
  return null;
};

//Hàm validate không được để trống
export const validateRequired = (value: string, fieldName: string): ValidationResult => {
  if (!value.trim()) return `${fieldName} không được để trống`;
  return null;
};