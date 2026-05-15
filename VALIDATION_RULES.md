# Validation Rules for Gate Pass System

## Password Validation Rules

### Requirements
- **Minimum Length**: 8 characters
- **Location**: Enforced in both login and registration forms

### Login Page
- Password validation message shown if user enters less than 8 characters
- Error message: "Password must be at least 8 characters"
- Form submission blocked if password doesn't meet requirements

### Registration Page
- Password field with live validation feedback
- Displays "Strong password" checkmark when 8+ characters entered
- Confirm password field validates both fields match
- Shows "Passwords match" confirmation when both fields are equal and meet minimum length
- Form submission blocked if passwords don't match or don't meet minimum length

---

## Phone Number Validation Rules

### Requirements
- **Length**: Exactly 10 digits
- **Format**: Numeric only (no special characters or letters)
- **Location**: Student registration form (Parent Phone Number field)

### Registration Page
- Phone number field automatically strips non-numeric characters
- Input limited to 10 digits maximum
- Live validation feedback:
  - Error icon and message: "Phone number must be exactly 10 digits" if invalid
  - Success icon and message: "Valid phone number" when exactly 10 digits entered
- Form submission blocked if phone number doesn't meet requirements
- Field is optional for non-student roles (Advisors, HOD, etc.)

---

## Other Validation Rules

### Roll Number
- Required field
- Minimum 2 characters
- Used for user identification and uniqueness check

### Name
- Required field
- Minimum 2 characters
- Full name of the user

---

## Implementation Details

### Files Modified
1. `/lib/validation.ts` - Centralized validation functions
2. `/app/page.tsx` - Login page with password validation
3. `/app/register/page.tsx` - Registration form with all validations

### Validation Functions Available
- `validatePassword(password: string)` - Checks minimum 8 character requirement
- `validatePhoneNumber(phone: string)` - Checks exactly 10 digits
- `validateRollNumber(rollNo: string)` - Checks minimum 2 characters
- `validateName(name: string)` - Checks minimum 2 characters

### User Feedback
- Red error borders on invalid fields
- Clear error messages with AlertCircle icons
- Green success checkmarks for valid inputs
- Real-time validation as user types
