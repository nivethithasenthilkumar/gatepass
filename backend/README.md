# College Gate Pass System - Backend

A comprehensive Spring Boot backend for managing college gate pass requests with role-based approval workflows.

## Features

- **User Management**: Students, Advisors, HODs, Principal, Wardens, Deputy Wardens, and Security personnel
- **Gate Pass Management**: Create, approve, reject, and track gate passes
- **Role-based Approval Workflow**: Automatic routing based on user roles and hostel type
- **QR Code Generation**: Generate QR codes for approved gate passes
- **Security Scanning**: Scan students in/out using QR codes
- **JWT Authentication**: Secure API endpoints with JWT tokens
- **Real-time Status Tracking**: Track approval status and scan logs

## Technology Stack

- **Framework**: Spring Boot 3.2.0
- **Security**: Spring Security with JWT
- **Database**: H2 (in-memory for development)
- **ORM**: Spring Data JPA
- **QR Code**: ZXing library
- **Build Tool**: Maven
- **Java Version**: 17

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Gate Passes
- `GET /api/gatepasses` - Get gate passes (filtered by role)
- `POST /api/gatepasses` - Create new gate pass (Students only)
- `GET /api/gatepasses/{id}` - Get gate pass by ID
- `POST /api/gatepasses/{id}/approve` - Approve/Reject gate pass
- `GET /api/gatepasses/pending` - Get pending approvals
- `GET /api/gatepasses/approved` - Get approved passes (Security)
- `POST /api/gatepasses/{id}/scan-out` - Scan student out
- `POST /api/gatepasses/{id}/scan-in` - Scan student in

### Users
- `GET /api/users/me` - Get current user profile
- `GET /api/users` - Get all users (Admin/Principal)
- `GET /api/users/{id}` - Get user by ID
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

### QR Code
- `GET /api/qr/gatepass/{id}` - Get gate pass by QR scan
- `POST /api/qr/scan/{id}` - Process QR code scan

## User Roles & Permissions

### Student
- Create gate pass requests
- View own gate passes
- Download QR codes for approved passes

### Advisor
- Approve/reject gate passes from students in their department
- View pending approvals

### HOD (Head of Department)
- Approve/reject gate passes after advisor approval
- View department-wise gate passes

### Principal
- Approve/reject gate passes after HOD approval
- View all gate passes

### Warden/Deputy Warden
- Approve/reject gate passes for hostel students
- View hostel-wise gate passes

### Security
- Scan QR codes for student entry/exit
- View approved gate passes
- Log scan activities

## Approval Workflow

### Normal Hours (9 AM - 5 PM)
1. Student → Advisor → HOD → Principal → (Warden → Deputy Warden if hosteler) → Approved

### After Hours
1. Student → (Warden → Deputy Warden if hosteler) → Approved

## Sample Users

The system comes pre-loaded with sample users for testing:

### Students
- **STU001** / password123 (John Doe - CSE, BH1)
- **STU002** / password123 (Jane Smith - CCE, Girls Hostel)
- **STU003** / password123 (Mike Johnson - AIML, Day Scholar)

### Staff
- **ADV001** / password123 (Dr. Sarah Wilson - CSE Advisor)
- **HOD001** / password123 (Dr. Michael Chen - CSE HOD)
- **PRIN001** / password123 (Dr. James Thompson - Principal)
- **WAR001** / password123 (Dr. Mary Johnson - BH1 Warden)
- **SEC001** / password123 (Security Guard 1)

## Getting Started

### Prerequisites
- Java 17 or higher
- Maven 3.6 or higher

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Build the project**
   ```bash
   mvn clean install
   ```

3. **Run the application**
   ```bash
   mvn spring-boot:run
   ```

4. **Access the application**
   - API Base URL: `http://localhost:8080/api`
   - H2 Console: `http://localhost:8080/api/h2-console`
   - JDBC URL: `jdbc:h2:mem:gatepass`
   - Username: `sa`
   - Password: `password`

### Configuration

The application can be configured via `application.yml`:

```yaml
server:
  port: 8080

spring:
  datasource:
    url: jdbc:h2:mem:gatepass
    username: sa
    password: password

jwt:
  secret: mySecretKey123456789012345678901234567890
  expiration: 86400000 # 24 hours

cors:
  allowed-origins: http://localhost:3000,http://localhost:3001
```

## Testing the API

### Login Example
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "rollNo": "STU001",
    "password": "password123"
  }'
```

### Create Gate Pass Example
```bash
curl -X POST http://localhost:8080/api/gatepasses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -d '{
    "purpose": "Home visit",
    "nativePlace": "Chennai",
    "outDateTime": "2024-12-25T10:00:00",
    "inDateTime": "2024-12-27T18:00:00",
    "passType": "CASUAL"
  }'
```

## Database Schema

The application uses the following main entities:
- **User**: Stores user information and roles
- **GatePass**: Stores gate pass requests and status
- **Approval**: Stores approval/rejection records
- **ScanLog**: Stores security scan logs

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Different permissions for different roles
- **Password Encryption**: BCrypt password hashing
- **CORS Configuration**: Configurable cross-origin resource sharing
- **Input Validation**: Comprehensive request validation

## Development

### Adding New Features
1. Create/modify entities in `model` package
2. Add repository interfaces in `repository` package
3. Implement business logic in `service` package
4. Create REST endpoints in `controller` package
5. Add appropriate security annotations

### Database Changes
- The application uses H2 in-memory database for development
- Schema is auto-generated from JPA entities
- For production, configure a persistent database in `application.yml`

## Deployment

### Production Configuration
1. Update `application.yml` for production database
2. Configure proper JWT secret
3. Set up HTTPS
4. Configure logging levels
5. Set up monitoring and health checks

### Docker Deployment
```dockerfile
FROM openjdk:17-jdk-slim
COPY target/gatepass-backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License.