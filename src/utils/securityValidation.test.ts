import { sanitizeInput, validateEmail, validatePassword, validateUsername } from './securityValidation';

describe('Security Validation Functions', () => {
  describe('sanitizeInput', () => {
    it('should sanitize malicious input', () => {
      const maliciousInput = '<script>alert("xss")</script>';
      expect(sanitizeInput(maliciousInput)).toBe('');
    });

    it('should handle empty and null inputs', () => {
      expect(sanitizeInput('')).toBe('');
      expect(sanitizeInput(null as any)).toBe('');
      expect(sanitizeInput(undefined as any)).toBe('');
    });

    it('should preserve clean text', () => {
      const cleanText = 'Hello World';
      expect(sanitizeInput(cleanText)).toBe(cleanText);
    });
  });

  describe('validateEmail', () => {
    it('should validate correct email formats', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(validateEmail('user+tag@example.org')).toBe(true);
    });

    it('should reject invalid email formats', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
      expect(validateEmail('test@domain')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should validate strong passwords', () => {
      const result = validatePassword('StrongPass123');
      expect(result.isValid).toBe(true);
      expect(result.message).toBeUndefined();
    });

    it('should reject weak passwords', () => {
      const result = validatePassword('weak');
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('at least 8 characters');
    });

    it('should reject passwords without uppercase', () => {
      const result = validatePassword('lowercase123');
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('uppercase');
    });

    it('should reject passwords without lowercase', () => {
      const result = validatePassword('UPPERCASE123');
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('lowercase');
    });

    it('should reject passwords without numbers', () => {
      const result = validatePassword('NoNumbers');
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('number');
    });

    it('should reject empty passwords', () => {
      const result = validatePassword('');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Password is required');
    });
  });

  describe('validateUsername', () => {
    it('should validate correct usernames', () => {
      const result = validateUsername('validuser123');
      expect(result.isValid).toBe(true);
      expect(result.message).toBeUndefined();
    });

    it('should reject usernames that are too short', () => {
      const result = validateUsername('ab');
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('at least 3 characters');
    });

    it('should reject usernames that are too long', () => {
      const result = validateUsername('a'.repeat(21));
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('maximum 20 characters');
    });

    it('should reject usernames with invalid characters', () => {
      const result = validateUsername('user@name');
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('letters, numbers, and underscores');
    });

    it('should reject empty usernames', () => {
      const result = validateUsername('');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Username is required');
    });
  });
});