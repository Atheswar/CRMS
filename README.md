# 🏢 Campus Resource Management System (CRMS)

A modern, full-stack web application for managing conference room bookings, resources, and users. Built with **Spring Boot** backend and **React** frontend.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Running the Application](#-running-the-application)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Database Setup](#-database-setup)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 📅 **Booking Management**
- Create, view, and manage conference room bookings
- Real-time availability checking
- Time slot management (9 AM - 6 PM)
- Status tracking: PENDING, APPROVED, REJECTED
- Role-based approval (Admin auto-approves bookings)

### 🏛️ **Resource Management**
- Add and manage conference rooms and resources
- Resource types: Classroom, Lab, Event Hall
- Capacity tracking
- Availability status (Available/Unavailable)
- Full CRUD operations

### 👥 **User Management**
- User registration and profile management
- Role-based access: Admin, Staff, Student
- User status tracking (Active/Inactive)
- Email-based identification

---

## 🛠 Tech Stack

### **Backend**
- **Framework:** Spring Boot 4.0.3
- **Language:** Java 17
- **Database:** PostgreSQL
- **ORM:** JPA/Hibernate
- **API:** RESTful APIs with CORS support
- **Build Tool:** Maven

### **Frontend**
- **Framework:** React 18.2.0
- **Package Manager:** npm
- **HTTP Client:** Axios
- **Styling:** Custom CSS with responsive design

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

### 1. **Clone the Repository**
```bash
git clone <repository-url>
cd crms
```

### 2. **Backend Setup**

#### Configure Database Connection
Update `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/crms_db
spring.datasource.username=your_username
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```

#### Install Dependencies
```bash
mvn clean install
```

### 3. **Frontend Setup**

Navigate to the frontend directory:
```bash
cd frontend
npm install
```

---

## 🚀 Running the Application

### **Start the Backend Server**

From the project root:
```bash
mvn spring-boot:run
```

The API will be available at: `http://localhost:8080/api`

### **Start the Frontend Development Server**

From the `frontend` directory:
```bash
npm start
```

The application will open at: `http://localhost:3000`

### **Production Build**

Frontend:
```bash
npm run build
```

Backend:
```bash
mvn clean package
```

---

## 📁 Project Structure

```
crms/
├── src/
│   ├── main/
│   │   ├── java/com/crms/
│   │   │   ├── controller/        # REST API Controllers
│   │   │   ├── service/           # Business Logic
│   │   │   ├── repository/        # Data Access Layer
│   │   │   ├── entity/            # JPA Entities
│   │   │   ├── dto/               # Data Transfer Objects
│   │   │   ├── exception/         # Custom Exceptions
│   │   │   └── CrmsApplication.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
│       └── java/com/crms/
├── frontend/
│   ├── src/
│   │   ├── components/            # React Components
│   │   ├── api/                   # API Integration
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
├── pom.xml
└── README.md
```

---

## 🔌 API Endpoints

### **Users** (`/api/users`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | Get all users |
| POST | `/users` | Create a new user |

### **Resources** (`/api/resources`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/resources` | Get all resources |
| POST | `/resources` | Create a new resource |
| PUT | `/resources/{id}` | Update a resource |
| DELETE | `/resources/{id}` | Delete a resource |

### **Bookings** (`/api/bookings`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/bookings` | Get all bookings |
| POST | `/bookings?userId={id}&resourceId={id}` | Create a booking |
| PUT | `/bookings/{id}/status?status={status}` | Update booking status |
| GET | `/bookings/user/{userId}` | Get bookings by user |
| GET | `/bookings/resource/{resourceId}` | Get bookings by resource |
| GET | `/bookings/check-availability?resourceId={id}&date={date}&timeSlot={slot}` | Check availability |

---

## 🗄️ Database Setup

### Create Database
```sql
CREATE DATABASE crms_db;
```

### Database Schema
The application uses Hibernate's auto DDL feature (`ddl-auto=update`) to automatically create tables:

- **users** - User accounts
- **resources** - Conference rooms and resources
- **bookings** - Room bookings

---

## 🤝 Contributing

1. Create a new branch: `git checkout -b feature/YourFeature`
2. Commit changes: `git commit -m 'Add YourFeature'`
3. Push to branch: `git push origin feature/YourFeature`
4. Open a Pull Request

---

---

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Check existing documentation
- Contact the development team

---

## 🎉 Built With

- ❤️ Passion for Clean Code
- ☕ Lots of Coffee
- 🚀 Modern Technologies

**Happy Booking! 🎊**


