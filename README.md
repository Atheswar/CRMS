# 📅 Campus Resource Management System (CRMS)

A modern, full-stack web application for managing conference room bookings, resources, and users. Built with **Spring Boot** backend and **React** frontend.

---

## 🎯 Features

### 📅 **Booking Management**
- ✅ Create and manage room bookings
- ✅ Real-time availability checking
- ✅ Status tracking: PENDING, APPROVED, REJECTED
- ✅ Time slot management (9 AM - 6 PM)
- ✅ Role-based approval system

### 🏛️ **Resource Management**
- ✅ Add and manage conference rooms
- ✅ Resource types: Classroom, Lab, Event Hall
- ✅ Capacity tracking
- ✅ Availability status tracking
- ✅ Full CRUD operations

### 👥 **User Management**
- ✅ User registration and profiles
- ✅ Role-based access: Admin, Staff, Student
- ✅ User status tracking: Active/Inactive
- ✅ Email-based identification

---

## 🧠 Agentic AI Extension (In Progress)

The current backend logic is designed to support:

- 🤖 Natural language booking requests
- 🧩 LLM-based intent extraction
- 🔧 Backend tool invocation (availability check, validation, approval routing)
- 🔄 Controlled multi-step workflow execution

### Planned Evolution:

```
User Natural Language Input
        ↓
LLM Intent Extraction
        ↓
Backend Tool Execution Layer
        ↓
Validation + Decision Engine
        ↓
Structured Response
```

**This prepares CRMS for integration with Agentic frameworks and LLM orchestration pipelines.**

---

## 🛠️ Tech Stack

### **Backend**
- **Framework:** Spring Boot 4.0.3
- **Language:** Java 17
- **Database:** PostgreSQL
- **ORM:** JPA/Hibernate
- **Build Tool:** Maven
- **API:** RESTful with CORS support

### **Frontend**
- **Framework:** React 18.2.0
- **Build Tool:** Vite 5.0.0
- **HTTP Client:** Axios
- **Routing:** React Router v6
- **Styling:** Custom CSS with Responsive Design

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Java 17+** - [Download](https://www.oracle.com/java/technologies/downloads/)
- **Node.js 14+** & **npm** - [Download](https://nodejs.org/)
- **PostgreSQL** - [Download](https://www.postgresql.org/download/)
- **Maven** - [Download](https://maven.apache.org/download.cgi)
- **Git** - [Download](https://git-scm.com/)

---

## 📥 Installation

### 1. **Backend Setup**

Navigate to the backend directory:
```bash
cd crms
```

#### Configure Database
Create a PostgreSQL database:
```sql
CREATE DATABASE crms_db;
```

Update `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/crms_db
spring.datasource.username=your_username
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

spring.application.name=crms
server.port=8080
```

#### Install Maven Dependencies
```bash
mvn clean install
```

### 2. **Frontend Setup**

Navigate to the frontend directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

---

## 🚀 Running the Application

### **Start the Backend Server**

From the `crms` directory:
```bash
mvn spring-boot:run
```

✅ API will be available at: `http://localhost:8080/api`

### **Start the Frontend Development Server**

From the `frontend` directory:
```bash
npm run dev
```

✅ Application will open at: `http://localhost:3000`

### **Production Build**

Frontend:
```bash
npm run build
```

Backend:
```bash
mvn clean package
```

Jar file will be created in: `crms/target/crms-0.0.1-SNAPSHOT.jar`

---

## 📁 Project Structure

```
crms/
├── src/                                     # Backend (Spring Boot)
│   ├── main/
│   │   ├── java/com/crms/
│   │   │   ├── controller/                  # REST API Controllers
│   │   │   │   ├── UserController.java
│   │   │   │   ├── ResourceController.java
│   │   │   │   └── BookingController.java
│   │   │   ├── service/                     # Business Logic
│   │   │   │   ├── UserService.java
│   │   │   │   ├── ResourceService.java
│   │   │   │   └── BookingService.java
│   │   │   ├── repository/                  # Data Access Layer
│   │   │   │   ├── UserRepository.java
│   │   │   │   ├── ResourceRepository.java
│   │   │   │   └── BookingRepository.java
│   │   │   ├── entity/                      # JPA Entities
│   │   │   │   ├── User.java
│   │   │   │   ├── Resource.java
│   │   │   │   ├── Booking.java
│   │   │   │   ├── Role.java
│   │   │   │   ├── UserStatus.java
│   │   │   │   ├── ResourceType.java
│   │   │   │   ├── ResourceStatus.java
│   │   │   │   └── BookingStatus.java
│   │   │   ├── dto/                         # Data Transfer Objects
│   │   │   │   └── LoginRequest.java
│   │   │   ├── exception/                   # Custom Exceptions
│   │   │   │   ├── ResourceNotFoundException.java
│   │   │   │   ├── BookingConflictException.java
│   │   │   │   └── GlobalExceptionHandler.java
│   │   │   └── CrmsApplication.java         # Main Application Entry
│   │   └── resources/
│   │       ├── application.properties       # Configuration
│   │       ├── static/                      # Static Resources
│   │       └── templates/                   # Templates
│   └── test/
│       └── java/com/crms/
│           └── CrmsApplicationTests.java
│
├── frontend/                                # Frontend (React)
│   ├── src/
│   │   ├── pages/                           # Page Components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Bookings.jsx
│   │   │   ├── Resources.jsx
│   │   │   └── UserManagement.jsx
│   │   ├── components/                      # Reusable Components
│   │   │   ├── Sidebar.jsx
│   │   │   └── ui.jsx
│   │   ├── api/                             # API Service Layer
│   │   │   └── api.js
│   │   ├── App.jsx                          # Main App Component
│   │   ├── index.css                        # Global Styles
│   │   └── index.jsx                        # React Entry Point
│   ├── public/                              # Public Assets
│   ├── index.html                           # HTML Template
│   ├── vite.config.js                       # Vite Configuration
│   └── package.json                         # Dependencies
│
├── target/                                  # Build Output
│   ├── classes/                             # Compiled Classes
│   ├── generated-sources/                   # Generated Code
│   └── test-classes/                        # Test Classes
│
├── pom.xml                                  # Maven Configuration
├── mvnw                                     # Maven Wrapper (Unix)
├── mvnw.cmd                                 # Maven Wrapper (Windows)
├── HELP.md
└── README.md
```

---

## 🔌 API Endpoints

### **Users** (`/api/users`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | Get all users |
| POST | `/users` | Create a new user |
| PUT | `/users/{id}` | Update user |
| DELETE | `/users/{id}` | Delete user |

### **Resources** (`/api/resources`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/resources` | Get all resources |
| POST | `/resources` | Create resource |
| PUT | `/resources/{id}` | Update resource |
| DELETE | `/resources/{id}` | Delete resource |

### **Bookings** (`/api/bookings`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/bookings` | Get all bookings |
| POST | `/bookings` | Create booking |
| PUT | `/bookings/{id}/status` | Update booking status |
| GET | `/bookings/user/{userId}` | Get user bookings |
| GET | `/bookings/resource/{resourceId}` | Get resource bookings |
| GET | `/bookings/check-availability` | Check room availability |

---

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  role VARCHAR(50),
  status VARCHAR(50)
);
```

### Resources Table
```sql
CREATE TABLE resources (
  id BIGINT PRIMARY KEY,
  name VARCHAR(255),
  type VARCHAR(50),
  capacity INT,
  status VARCHAR(50)
);
```

### Bookings Table
```sql
CREATE TABLE bookings (
  id BIGINT PRIMARY KEY,
  user_id BIGINT,
  resource_id BIGINT,
  booking_date DATE,
  time_slot VARCHAR(50),
  status VARCHAR(50)
);
```

---

## � Deployment to Render

Deploy your application to the cloud with two methods:

### 📦 Native Buildpack (Recommended for Beginners)
Simple and fast deployment without Docker.
```bash
# See detailed guide
DEPLOYMENT.md
```

### 🐳 Docker Deployment (Recommended for Production)
Full control with Docker containerization.
```bash
# Test locally first
docker-compose up --build

# See detailed guide
DEPLOYMENT-DOCKER.md
```

### 🎯 Not Sure Which to Choose?
See [DEPLOYMENT-GUIDE.md](DEPLOYMENT-GUIDE.md) for a detailed comparison and recommendation.

**Quick Deploy:**
1. Push code to GitHub
2. Create free account on [Render](https://render.com)
3. Follow deployment guide
4. Your app will be live in 10-15 minutes! 🎉

---

## �🔮 Future Roadmap

### Phase 1: AI Integration
- 🤖 Natural language processing for booking requests
- 🧠 LLM-powered intent recognition
- 🔄 Automated workflow orchestration

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/YourFeature`
3. Commit changes: `git commit -m 'Add YourFeature'`
4. Push to branch: `git push origin feature/YourFeature`
5. Open a Pull Request

---

## 📞 Support & Contact

- Contact via E-mail
- Atheswar M A
- athesmuthu@gmail.com

---

## 🎉 Quick Commands Reference

```bash
# Backend
cd crms
mvn clean install
mvn spring-boot:run

# Frontend
cd frontend
npm install
npm run dev

# Production Build
npm run build
mvn clean package

# Git
git add .
git commit -m "Your message"
git push origin main
```

---

## ✨ Built With

- ❤️ Passion for Clean Code
- ☕ Coffee (lots of it!)
- 🚀 Modern Technologies
- 💪 Teamwork & Dedication
- 🧠 AI-Ready Architecture

---

**Happy Coding! 🚀**