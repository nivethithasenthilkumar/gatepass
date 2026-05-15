# 🔐 Smart Gatepass Management System

A web application for managing visitor access with QR codes, automated approvals, and real-time tracking.

---

## 📸 Screenshots

### Login Page
<img width="1918" height="1078" alt="Screenshot 2026-05-15 110623" src="https://github.com/user-attachments/assets/e5ea0d25-10a9-4d11-90b6-fae778b89307" />


### Registration Page
<img width="1918" height="1078" alt="Screenshot 2026-05-15 100724" src="https://github.com/user-attachments/assets/53b1020d-edef-4722-a79f-4d54286ff661" />


### Dashboard
<img width="1918" height="1078" alt="Screenshot 2026-05-15 110732" src="https://github.com/user-attachments/assets/2c9c903f-ae33-461b-9b0b-e70e2864ad24" />


---

## ✨ Features

- 🔑 User authentication (Login & Register)
- 👤 Visitor registration and management
- ✅ Automated approval workflow
- 🎫 QR code generation for gatepasses
- 📊 Real-time visitor tracking dashboard
- 🚨 Security alerts
- 📱 Mobile responsive design

---

## 🛠 Tech Stack

**Frontend:** Next.js, React, Tailwind CSS, TypeScript  
**Backend:** Spring Boot, Java, MySQL  
**Real-time:** WebSocket, JWT Authentication

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Java 11+
- MySQL 8.0+

### Frontend Setup
```bash
npm install
npm run dev
```
Visit: http://localhost:3000

### Backend Setup
```bash
cd backend
mvn spring-boot:run
```
Backend runs on: http://localhost:8080

### Database Setup
```bash
mysql -u root -p
CREATE DATABASE gatepass_db;
source mysql_init.sql;
```

---

## 📁 Project Structure

```
gatepass/
├── app/                    # Next.js pages (Login, Register, Dashboard)
├── components/             # React components
├── backend/               # Spring Boot API
├── lib/                   # Utility functions
└── public/                # Static files
```

---

## 🔑 Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/register` | User register |
| POST | `/api/visitors/register` | Register visitor |
| GET | `/api/dashboard/stats` | Get dashboard statistics |
| GET | `/api/gatepasses/{id}` | Get gatepass details |
| POST | `/api/gatepasses/{id}/approve` | Approve gatepass |

---

## 🔒 Security Features

- JWT token authentication
- Password hashing (BCrypt)
- Role-based access control
- Unique QR codes for each gatepass
- Activity logging and audit trail

---

## 📱 Features by User Role

**Admin:**
- View all visitors
- Approve/Reject applications
- Manage users

**Approver:**
- Review visitor requests
- Approve/Reject gatepasses
- View statistics

**Gate Staff:**
- Scan QR codes
- Mark check-in/check-out
- View active visitors

---

## 🐛 Troubleshooting

**Frontend won't connect to backend?**
- Check backend is running on `localhost:8080`
- Verify `NEXT_PUBLIC_API_URL` in `.env.local`

**Database connection error?**
- Verify MySQL is running
- Check credentials in `backend/application.yml`
- Ensure database is created

**QR code not working?**
- Clear browser cache
- Refresh page
- Check backend logs

---

## 📧 Contact

**Email:** nivethitha1703senthilkumar@gmail.com  
**GitHub:** [@nivethithasenthilkumar](https://github.com/nivethithasenthilkumar)  
**LinkedIn:** [Nivethitha Senthil Kumar](https://linkedin.com/in/nivethitha-senthil-kumar-a245292b2)

---

## 📄 License

MIT License - Feel free to use this project!

---

**Version:** 1.0.0 | **Last Updated:** May 2025
