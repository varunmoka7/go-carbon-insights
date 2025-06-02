
import DOMPurify from 'isomorphic-dompurify';

// Input sanitization for user inputs
export const sanitizeInput = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  
  // Remove any potential XSS vectors
  return DOMPurify.sanitize(input.trim(), { 
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [] 
  });
};

// Email validation with security considerations
export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  const sanitizedEmail = sanitizeInput(email);
  
  if (!sanitizedEmail) {
    return { isValid: false, error: 'Email is required' };
  }
  
  // Enhanced email regex that prevents common bypass attempts
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  if (!emailRegex.test(sanitizedEmail)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  if (sanitizedEmail.length > 254) {
    return { isValid: false, error: 'Email address is too long' };
  }
  
  return { isValid: true };
};

// Username validation with security considerations
export const validateUsername = (username: string): { isValid: boolean; error?: string } => {
  const sanitizedUsername = sanitizeInput(username);
  
  if (!sanitizedUsername) {
    return { isValid: false, error: 'Username is required' };
  }
  
  // Username must be alphanumeric with underscores and hyphens, 3-20 characters
  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
  
  if (!usernameRegex.test(sanitizedUsername)) {
    return { isValid: false, error: 'Username must be 3-20 characters and contain only letters, numbers, underscores, and hyphens' };
  }
  
  // Prevent reserved usernames
  const reservedUsernames = ['admin', 'administrator', 'root', 'api', 'www', 'mail', 'support', 'help', 'null', 'undefined'];
  
  if (reservedUsernames.includes(sanitizedUsername.toLowerCase())) {
    return { isValid: false, error: 'This username is not available' };
  }
  
  return { isValid: true };
};

// Password validation with security requirements
export const validatePassword = (password: string): { isValid: boolean; error?: string } => {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }
  
  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters long' };
  }
  
  if (password.length > 128) {
    return { isValid: false, error: 'Password is too long' };
  }
  
  // Check for at least one lowercase, uppercase, digit, and special character
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  
  if (!hasLowercase || !hasUppercase || !hasDigit || !hasSpecialChar) {
    return { 
      isValid: false, 
      error: 'Password must contain at least one lowercase letter, uppercase letter, digit, and special character' 
    };
  }
  
  // Check against common passwords
  const commonPasswords = ['password', '12345678', 'qwerty123', 'admin123', 'letmein'];
  if (commonPasswords.includes(password.toLowerCase())) {
    return { isValid: false, error: 'Please choose a more secure password' };
  }
  
  return { isValid: true };
};

// Comprehensive form validation
export const validateAuthForm = (data: {
  email?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
}): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  
  if (data.email) {
    const emailValidation = validateEmail(data.email);
    if (!emailValidation.isValid) {
      errors.email = emailValidation.error!;
    }
  }
  
  if (data.username) {
    const usernameValidation = validateUsername(data.username);
    if (!usernameValidation.isValid) {
      errors.username = usernameValidation.error!;
    }
  }
  
  if (data.password) {
    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.error!;
    }
  }
  
  if (data.confirmPassword && data.password) {
    if (data.password !== data.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Rate limiting helper for client-side throttling
export const createRateLimiter = (maxAttempts: number, windowMs: number) => {
  const attempts = new Map<string, { count: number; resetTime: number }>();
  
  return (identifier: string): boolean => {
    const now = Date.now();
    const userAttempts = attempts.get(identifier);
    
    if (!userAttempts || now > userAttempts.resetTime) {
      attempts.set(identifier, { count: 1, resetTime: now + windowMs });
      return true;
    }
    
    if (userAttempts.count >= maxAttempts) {
      return false;
    }
    
    userAttempts.count++;
    return true;
  };
};

// Create rate limiters for different actions
export const loginRateLimiter = createRateLimiter(5, 15 * 60 * 1000); // 5 attempts per 15 minutes
export const signupRateLimiter = createRateLimiter(3, 60 * 60 * 1000); // 3 attempts per hour
export const passwordResetRateLimiter = createRateLimiter(3, 60 * 60 * 1000); // 3 attempts per hour
