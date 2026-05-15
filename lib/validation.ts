// Validation Rules for Gate Pass System

export const VALIDATION_RULES = {
  PASSWORD: {
    MIN_LENGTH: 8,
    message: 'Password must be at least 8 characters',
  },
  PHONE: {
    EXACT_LENGTH: 10,
    REGEX: /^\d{10}$/,
    message: 'Phone number must be exactly 10 digits',
  },
};

// Validation Functions
export function validatePassword(password: string): { isValid: boolean; error?: string } {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }
  if (password.length < VALIDATION_RULES.PASSWORD.MIN_LENGTH) {
    return { isValid: false, error: VALIDATION_RULES.PASSWORD.message };
  }
  return { isValid: true };
}

export function validatePhoneNumber(phone: string): { isValid: boolean; error?: string } {
  if (!phone) {
    return { isValid: false, error: 'Phone number is required' };
  }
  if (!VALIDATION_RULES.PHONE.REGEX.test(phone)) {
    return { isValid: false, error: VALIDATION_RULES.PHONE.message };
  }
  return { isValid: true };
}

export function validateRollNumber(rollNo: string): { isValid: boolean; error?: string } {
  if (!rollNo) {
    return { isValid: false, error: 'Roll Number is required' };
  }
  if (rollNo.trim().length < 2) {
    return { isValid: false, error: 'Roll Number must be at least 2 characters' };
  }
  return { isValid: true };
}

export function validateName(name: string): { isValid: boolean; error?: string } {
  if (!name) {
    return { isValid: false, error: 'Name is required' };
  }
  if (name.trim().length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters' };
  }
  return { isValid: true };
}
