# PRISM Backend API - Complete Documentation

Personnel Records and Information System Management - Backend API

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [System Architecture](#system-architecture)
4. [Prerequisites & Installation](#prerequisites--installation)
5. [Configuration](#configuration)
6. [Database Setup & Seeding](#database-setup--seeding)
7. [Authentication & Authorization](#authentication--authorization)
8. [API Reference](#api-reference)
9. [Data Models](#data-models)
10. [Query Parameters & Filtering](#query-parameters--filtering)
11. [Error Handling](#error-handling)
12. [Security](#security)
13. [Logging & Monitoring](#logging--monitoring)
14. [Testing](#testing)
15. [Deployment](#deployment)
16. [Development Guidelines](#development-guidelines)
17. [Troubleshooting](#troubleshooting)
18. [Appendix](#appendix)

---

## Overview

PRISM (Personnel Records and Information System Management) is a comprehensive backend API designed specifically for military personnel management AND ONLY FOR USE IN 3RD NSB DCM-D. The system handles the complete lifecycle of military personnel data, including attendance tracking, training exercises, performance evaluations, and organizational structure management.

### Key Capabilities

- **Personnel Management**: Complete soldier records with hierarchical unit assignments
- **Attendance Systems**: Daily attendance tracking with multiple status types and bulk operations
- **Training Management**: Exercise planning, execution, and attendance tracking
- **Evaluation Framework**: Performance evaluations with detailed rating systems
- **Task Organization**: Training task definitions and categorization
- **Unit Structure**: Hierarchical organizational unit management
- **Analytics & Reporting**: Comprehensive statistics and data analysis

### Target Users

- **Military Administrators**: Full system management capabilities
- **Unit Supervisors**: Personnel and training management within the unit
- **Training Coordinators**: Exercise and evaluation management
- **Reporting Officers**: Statistical analysis and reporting

---

## Features

### Core Features

#### 🔐 Authentication & Authorization

- JWT-based stateless authentication
- Role-based access control (Admin/Superuser)
- Token expiration and refresh mechanisms
- Secure password hashing with bcrypt

#### 👥 Personnel Management

- Complete soldier profiles with personal and military information
- Hierarchical unit assignment (Primary Unit → Sub Unit) (Example: RIS burys → LAN/WAN)
- Military rank management with predefined hierarchy
- Active/inactive status tracking
- Join date and service history

#### 📅 Attendance Tracking

- Daily attendance recording with multiple status types:
  - Present, Absent, Sick, Leave, Mission, Other
- Bulk attendance operations for efficient data entry
- Date-range queries and filtering
- Unit-based attendance statistics
- Automated attendance rate calculations

#### 🎯 Exercise Management

- Training exercise planning and scheduling
- Participant management with attendance tracking
- Instructor assignment and management
- Exercise stages: IS (Igudziu suteikimas), IT (Igudziu tobulinimas), II (Igudziu itvirtinimas)
- Duration tracking and statistics
- Task-based exercise categorization

#### 📊 Evaluation System

- Official and unofficial evaluation recording
- Individual soldier rating system:
  - I (Įvykdyta - Completed)
  - IA (Įvykdyta anksciau - Completed earlier)
  - NI (Neįvykdyta - Not Completed)
  - "-" (Nevertinama - Not Evaluated)
- Task-based evaluation framework
- Performance statistics and pass rate calculations

#### 📋 Task Management

- Training task definitions and descriptions
- Task categorization: Individual vs Collective
- Task-exercise relationship management

#### 🏢 Structural Units

- Hierarchical organizational structure
- Predefined unit templates for Lithuanian military structure
- Active/inactive unit management
- Unit-based personnel assignment

### Advanced Features

#### 📈 Analytics & Statistics

- Real-time attendance rate calculations
- Exercise participation analytics
- Evaluation pass rate statistics
- Unit-based performance metrics
- Time-series data analysis

#### 🔍 Search & Filtering

- Advanced search across all entities
- Date range filtering
- Unit-based filtering
- Status-based queries
- Combined filter operations

#### 📤 Bulk Operations

- Bulk attendance recording
- Batch data imports
- Mass status updates

---

## System Architecture

### Technology Stack

```
┌─────────────────┐
│   Frontend      │
│   (React.js)    │
└─────────┬───────┘
          │ HTTP/REST API
┌─────────▼───────┐
│   Backend       │
│   (Express.js)  │
│   - Controllers │
│   - Middleware  │
│   - Routes      │
└─────────┬───────┘
          │ Mongoose ODM
┌─────────▼───────┐
│   Database      │
│   (MongoDB)     │
└─────────────────┘
```

### Project Structure

```
src/
├── controllers/           # Business logic handlers
│   ├── auth.js           # Authentication & user management
│   ├── soldiers.js       # Personnel management
│   ├── attendance.js     # Attendance tracking
│   ├── exercises.js      # Exercise management
│   ├── evaluation.js     # Evaluation system
│   ├── tasks.js          # Task management
│   └── structuralUnits.js # Organizational structure
├── models/               # Database schemas
│   ├── user.js           # User authentication model
│   ├── soldier.js        # Soldier profile model
│   ├── attendance.js     # Attendance record model
│   ├── exercise.js       # Exercise model
│   ├── evaluation.js     # Evaluation model
│   ├── task.js           # Task definition model
│   └── structuralUnit.js # Organizational unit model
├── routes/               # API route definitions
│   ├── auth.js
│   ├── soldiers.js
│   ├── attendance.js
│   ├── exercises.js
│   ├── evaluation.js
│   ├── tasks.js
│   └── structuralUnits.js
├── middleware/           # Custom middleware
│   └── auth.js           # Authentication middleware
├── utils/                # Utility functions
│   ├── errorHandling.js  # Error management
│   ├── logger.js         # Logging utilities
│   └── validation.js     # Input validation
├── seeder.js             # Database seeding script
└── server.js             # Application entry point
```

---

## Prerequisites & Installation

### System Requirements

- **Node.js**: Version 16.0 or higher
- **MongoDB**: Version 4.4 or higher
- **NPM**: Version 7.0 or higher (comes with Node.js)
- **Memory**: Minimum 512MB RAM
- **Storage**: Minimum 1GB free space

### Installation Steps

#### 1. Clone Repository

```bash
git clone <repository-url>
cd prism-backend
```

#### 2. Install Dependencies

```bash
# Install all dependencies
npm install

# Verify installation
npm list --depth=0
```

#### 3. Verify MongoDB Installation

```bash
# Check MongoDB status
mongosh --eval "db.adminCommand('ismaster')"

# Or check if MongoDB service is running
# Windows:
net start MongoDB

# Linux/macOS:
sudo systemctl status mongod
# or
brew services list | grep mongodb
```

#### 4. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit configuration (see Configuration section)
nano .env  # or your preferred editor
```

#### 5. Database Initialization

```bash
# Seed the database with initial data
npm run seed
```

#### 6. Start Development Server

```bash
# Start in development mode with auto-reload
npm run dev

# Or start in production mode
npm start
```

#### 7. Verify Installation

```bash
# Test API endpoint
curl http://localhost:5000/

# Expected response:
# {"message":"Welcome to the PRISM API"}
```

---

## Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

#### Required Variables

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb://localhost:27017/prism

# Security Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random_at_least_32_characters
```

#### Optional Variables

```env
# CORS Configuration
FRONTEND_URL=http://localhost:3000

# Additional Security
JWT_EXPIRE=24h

# Database Options
MONGO_OPTIONS={}
```

### Configuration Details

#### PORT

- **Default**: 5000
- **Description**: Port number for the server
- **Production**: Use environment-specific port (e.g., 80, 443)

#### NODE_ENV

- **Values**: `development`, `production`, `test`
- **Default**: development
- **Description**: Determines logging level and error verbosity

#### MONGO_URI

- **Format**: `mongodb://[username:password@]host[:port]/database[?options]`
- **Local**: `mongodb://localhost:27017/prism`
- **Production**: Use connection string from your MongoDB provider

#### JWT_SECRET

- **Requirements**: At least 32 characters, random, unique
- **Generation**: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- **Security**: Never share or commit this value

### MongoDB Configuration

#### Local Development

```bash
# Start MongoDB
mongod --dbpath /path/to/your/data/directory

# Or if installed via package manager
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # macOS
```

#### Production Configuration

```javascript
// MongoDB connection options
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4,
};
```

---

## Database Setup & Seeding

### Initial Database Setup

#### 1. Create Database

MongoDB will automatically create the database when you first connect, but you can manually create it:

```javascript
// Connect to MongoDB
mongosh

// Create database
use prism

// Verify creation
show dbs
```

#### 2. Run Seeder Script

The seeder script creates initial data including default users, structural units, and sample tasks:

```bash
npm run seed
```

### Seeded Data

#### Default Users

```javascript
// Admin User
{
  username: "admin",
  password: "admin123",  // Change in production!
  role: "admin"
}

// Superuser
{
  username: "superuser",
  password: "super123",  // Change in production!
  role: "superuser"
}
```

#### Default Structural Units

```javascript
// Primary Units
["Paramos burys", "Rysiu ir informaciniu sistemu burys", "Valdymo grupe"][
  // Sub-units for "Rysiu ir informaciniu sistemu burys"
  ("RIS burys",
  "LAN/WAN skyrius",
  "Videotelekonferencijos skyrius",
  "Laidinio rysio skyrius",
  "Kompiuteriniui tinklu skyrius",
  "1 rysiu skyrius",
  "2 rysiu skyrius",
  "Vartotoju aptarnavimo skyrius"),
  // Sub-units for "Paramos burys" (Coming soon)
  ("Logistikos burys",
  "Tiekimo skyrius",
  "Kriptografijos skyrius",
  "Transporto eksploatavimo skyrius",
  "RIS irangos energijos tiekimo skyrius",
  "RIS irangos kondicionavimo skyrius",
  ),
  // Sub-units for "PRISM valdymo grupe"
  ("PRISM valdymo grupe")
];
```

#### Sample Tasks

```javascript
[
  {
    name: "Fizinio pasirengimo patikrinimas",
    description: "Metinis fizinio pasirengimo testas",
    type: "Individualios",
  },
  {
    name: "Saudymo mokymai",
    description: "Ginklu naudojimo ir saudymo mokymai",
    type: "Individualios",
  },
  {
    name: "Taktikos mokymai",
    description: "Taktiniu veiksmu mokymai",
    type: "Kolektyvines",
  },
  // ... more tasks
];
```

### Custom Seeding

You can modify the seeder script (`src/seeder.js`) to add custom data:

```javascript
// Add custom structural units
const customUnits = [
  {
    name: "Custom Unit Name",
    parentUnit: "Paramos burys",
    active: true,
  },
];

await StructuralUnit.insertMany(customUnits);
```

---

## Authentication & Authorization

### Authentication Flow

```mermaid
sequenceDiagram
    participant Client
    participant API
    participant DB

    Client->>API: POST /auth/login {username, password}
    API->>DB: Find user by username
    DB-->>API: User data
    API->>API: Verify password (bcrypt)
    API->>API: Generate JWT token
    API-->>Client: {user, token}

    Note over Client: Store token

    Client->>API: GET /protected-route {Authorization: Bearer token}
    API->>API: Verify JWT token
    API->>DB: Get current user data
    DB-->>API: User data
    API-->>Client: Protected resource
```

### JWT Token Structure

```javascript
// Token Header
{
  "alg": "HS256",
  "typ": "JWT"
}

// Token Payload
{
  "id": "user_id_here",
  "iat": 1640995200,  // Issued at timestamp
  "exp": 1641081600   // Expiration timestamp
}
```

### Role-Based Access Control

#### Admin Role

- **Full Access**: All CRUD operations
- **User Management**: Create, read, update, delete users
- **System Configuration**: Manage structural units
- **Data Management**: Delete any records

```javascript
// Admin permissions
const adminPermissions = [
  "users:create",
  "users:read",
  "users:update",
  "users:delete",
  "soldiers:create",
  "soldiers:read",
  "soldiers:update",
  "soldiers:delete",
  "attendance:create",
  "attendance:read",
  "attendance:update",
  "attendance:delete",
  "exercises:create",
  "exercises:read",
  "exercises:update",
  "exercises:delete",
  "evaluations:create",
  "evaluations:read",
  "evaluations:update",
  "evaluations:delete",
  "tasks:create",
  "tasks:read",
  "tasks:update",
  "tasks:delete",
  "units:create",
  "units:read",
  "units:update",
  "units:delete",
];
```

#### Superuser Role

- **Limited Access**: Create, read, update operations
- **No User Management**: Cannot manage user accounts
- **No Deletion**: Cannot delete records (except their own data)

```javascript
// Superuser permissions
const superuserPermissions = [
  "soldiers:create",
  "soldiers:read",
  "soldiers:update",
  "attendance:create",
  "attendance:read",
  "attendance:update",
  "exercises:create",
  "exercises:read",
  "exercises:update",
  "evaluations:create",
  "evaluations:read",
  "evaluations:update",
  "tasks:create",
  "tasks:read",
  "tasks:update",
  "units:create",
  "units:read",
  "units:update",
];
```

### Middleware Implementation

```javascript
// Authentication middleware
const protect = async (req, res, next) => {
  let token;

  // Get token from header
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      message: "Not authorized to access this route",
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Not authorized to access this route",
    });
  }
};

// Admin-only middleware
const adminOnly = (req, res, next) => {
  if (req.user?.role === "admin") {
    next();
  } else {
    res.status(403).json({
      message: "Access denied: Admin privileges required",
    });
  }
};
```

---

## API Reference

### Base URL

```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

### Authentication Headers

All protected endpoints require:

```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

---

## 🔐 Authentication Endpoints

### POST /auth/login

Authenticate user and receive JWT token.

**Request:**

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "username": "admin",
  "role": "admin",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**

```json
// 401 Unauthorized
{
  "message": "Invalid credentials"
}

// 400 Bad Request
{
  "message": "Username and password are required"
}
```

### GET /auth/me

Get current user profile.

**Request:**

```http
GET /api/auth/me
Authorization: Bearer <token>
```

**Response:**

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "username": "admin",
  "role": "admin",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

### POST /auth/register

Register new user (Admin only).

**Request:**

```http
POST /api/auth/register
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "username": "newuser",
  "password": "securepassword123",
  "role": "superuser"
}
```

**Response:**

```json
{
  "_id": "507f1f77bcf86cd799439012",
  "username": "newuser",
  "role": "superuser"
}
```

### GET /auth/users

Get all users (Admin only).

**Request:**

```http
GET /api/auth/users
Authorization: Bearer <admin_token>
```

**Response:**

```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "username": "admin",
    "role": "admin",
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  {
    "_id": "507f1f77bcf86cd799439012",
    "username": "superuser",
    "role": "superuser",
    "createdAt": "2024-01-15T10:35:00.000Z"
  }
]
```

### DELETE /auth/users/:id

Delete user (Admin only).

**Request:**

```http
DELETE /api/auth/users/507f1f77bcf86cd799439012
Authorization: Bearer <admin_token>
```

**Response:**

```json
{
  "message": "User removed"
}
```

---

## 👥 Soldiers Endpoints

### GET /soldiers

Get all soldiers with optional filtering.

**Request:**

```http
GET /api/soldiers?primaryUnit=Paramos%20burys&active=true
Authorization: Bearer <token>
```

**Query Parameters:**

- `primaryUnit` (string): Filter by primary unit
- `subUnit` (string): Filter by sub unit
- `active` (boolean): Filter by active status

**Response:**

```json
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "firstName": "Jonas",
    "lastName": "Jonaitis",
    "militaryRank": "Seržantas",
    "joinDate": "2023-01-15T00:00:00.000Z",
    "primaryUnit": "Paramos burys",
    "subUnit": null,
    "active": true
  }
]
```

### GET /soldiers/:id

Get soldier by ID.

**Request:**

```http
GET /api/soldiers/507f1f77bcf86cd799439013
Authorization: Bearer <token>
```

**Response:**

```json
{
  "_id": "507f1f77bcf86cd799439013",
  "firstName": "Jonas",
  "lastName": "Jonaitis",
  "militaryRank": "Seržantas",
  "joinDate": "2023-01-15T00:00:00.000Z",
  "primaryUnit": "Paramos burys",
  "subUnit": null,
  "active": true
}
```

### POST /soldiers

Create new soldier (Admin/Superuser).

**Request:**

```http
POST /api/soldiers
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "Petras",
  "lastName": "Petraitis",
  "militaryRank": "Eilinis",
  "joinDate": "2024-01-15",
  "primaryUnit": "Rysiu ir informaciniu sistemu burys",
  "subUnit": "RIS burys",
  "active": true
}
```

**Response:**

```json
{
  "_id": "507f1f77bcf86cd799439014",
  "firstName": "Petras",
  "lastName": "Petraitis",
  "militaryRank": "Eilinis",
  "joinDate": "2024-01-15T00:00:00.000Z",
  "primaryUnit": "Rysiu ir informaciniu sistemu burys",
  "subUnit": "RIS burys",
  "active": true
}
```

**Validation Rules:**

- `firstName`: Required, 2-50 characters
- `lastName`: Required, 2-50 characters
- `militaryRank`: Required, must be from predefined list
- `joinDate`: Required, cannot be future date
- `primaryUnit`: Required, must be valid unit
- `subUnit`: Required if primaryUnit is "Rysiu ir informaciniu sistemu burys"

### PUT /soldiers/:id

Update soldier (Admin/Superuser).

**Request:**

```http
PUT /api/soldiers/507f1f77bcf86cd799439014
Authorization: Bearer <token>
Content-Type: application/json

{
  "militaryRank": "Vyresnysis Eilinis",
  "active": true
}
```

**Response:**

```json
{
  "_id": "507f1f77bcf86cd799439014",
  "firstName": "Petras",
  "lastName": "Petraitis",
  "militaryRank": "Vyresnysis Eilinis",
  "joinDate": "2024-01-15T00:00:00.000Z",
  "primaryUnit": "Rysiu ir informaciniu sistemu burys",
  "subUnit": "RIS burys",
  "active": true
}
```

### DELETE /soldiers/:id

Delete soldier (Admin only).

**Request:**

```http
DELETE /api/soldiers/507f1f77bcf86cd799439014
Authorization: Bearer <admin_token>
```

**Response:**

```json
{
  "message": "Soldier removed successfully"
}
```

---

## 📅 Attendance Endpoints

### GET /attendance

Get all attendance records with filtering.

**Request:**

```http
GET /api/attendance?startDate=2024-01-01&endDate=2024-01-31&unit=Paramos%20burys
Authorization: Bearer <token>
```

**Query Parameters:**

- `startDate` (string): Start date (YYYY-MM-DD)
- `endDate` (string): End date (YYYY-MM-DD)
- `date` (string): Specific date (YYYY-MM-DD)
- `unit` (string): Filter by unit
- `status` (string): Filter by attendance status
- `soldier` (string): Filter by soldier ID

**Response:**

```json
[
  {
    "_id": "507f1f77bcf86cd799439015",
    "date": "2024-01-15T00:00:00.000Z",
    "soldier": {
      "_id": "507f1f77bcf86cd799439013",
      "firstName": "Jonas",
      "lastName": "Jonaitis",
      "militaryRank": "Seržantas"
    },
    "status": "Present",
    "reason": "",
    "unit": "Paramos burys",
    "createdBy": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "admin"
    },
    "createdAt": "2024-01-15T08:00:00.000Z"
  }
]
```

### GET /attendance/date/:date

Get attendance for specific date.

**Request:**

```http
GET /api/attendance/date/2024-01-15?unit=Paramos%20burys
Authorization: Bearer <token>
```

**Response:**

```json
[
  {
    "_id": "507f1f77bcf86cd799439015",
    "date": "2024-01-15T00:00:00.000Z",
    "soldier": {
      "_id": "507f1f77bcf86cd799439013",
      "firstName": "Jonas",
      "lastName": "Jonaitis",
      "militaryRank": "Seržantas",
      "primaryUnit": "Paramos burys",
      "subUnit": null
    },
    "status": "Present",
    "reason": "",
    "unit": "Paramos burys"
  }
]
```

### POST /attendance

Create attendance record (Admin/Superuser).

**Request:**

```http
POST /api/attendance
Authorization: Bearer <token>
Content-Type: application/json

{
  "date": "2024-01-15",
  "soldier": "507f1f77bcf86cd799439013",
  "status": "Sick",
  "reason": "Medical leave",
  "unit": "Paramos burys"
}
```

**Response:**

```json
{
  "_id": "507f1f77bcf86cd799439016",
  "date": "2024-01-15T00:00:00.000Z",
  "soldier": {
    "_id": "507f1f77bcf86cd799439013",
    "firstName": "Jonas",
    "lastName": "Jonaitis",
    "militaryRank": "Seržantas"
  },
  "status": "Sick",
  "reason": "Medical leave",
  "unit": "Paramos burys",
  "createdBy": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "admin"
  }
}
```

**Attendance Status Types:**

- `Present`: Soldier is present
- `Absent`: Soldier is absent (reason required)
- `Sick`: Soldier on sick leave (reason required)
- `Leave`: Soldier on authorized leave (reason required)
- `Mission`: Soldier on mission/duty (reason required)
- `Other`: Other status (reason required)

### POST /attendance/bulk

Create multiple attendance records (Admin/Superuser).

**Request:**

```http
POST /api/attendance/bulk
Authorization: Bearer <token>
Content-Type: application/json

{
  "date": "2024-01-15",
  "unit": "Paramos burys",
  "records": [
    {
      "soldier": "507f1f77bcf86cd799439013",
      "status": "Present",
      "reason": ""
    },
    {
      "soldier": "507f1f77bcf86cd799439014",
      "status": "Sick",
      "reason": "Medical appointment"
    }
  ]
}
```

**Response:**

```json
{
  "created": 1,
  "updated": 1,
  "errors": []
}
```

### GET /attendance/stats

Get attendance statistics.

**Request:**

```http
GET /api/attendance/stats?unit=Paramos%20burys&startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <token>
```

**Response:**

```json
{
  "statusCounts": {
    "Present": 145,
    "Absent": 8,
    "Sick": 12,
    "Leave": 15,
    "Mission": 5,
    "Other": 3
  },
  "statusPercentages": {
    "Present": 77.1,
    "Absent": 4.3,
    "Sick": 6.4,
    "Leave": 8.0,
    "Mission": 2.7,
    "Other": 1.6
  },
  "totalRecords": 188,
  "timeSeriesData": [
    {
      "date": "2024-01-01",
      "Present": 12,
      "Absent": 1,
      "Sick": 0,
      "Leave": 2,
      "Mission": 0,
      "Other": 0
    }
  ]
}
```

---

## 🎯 Exercises Endpoints

### GET /exercises

Get all exercises with filtering.

**Request:**

```http
GET /api/exercises?unit=Paramos%20burys&startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <token>
```

**Query Parameters:**

- `unit` (string): Filter by unit
- `startDate` (string): Start date filter
- `endDate` (string): End date filter

**Response:**

```json
[
  {
    "_id": "507f1f77bcf86cd799439017",
    "taskId": {
      "_id": "507f1f77bcf86cd799439020",
      "name": "Fizinio pasirengimo patikrinimas"
    },
    "date": "2024-01-20T00:00:00.000Z",
    "duration": 2,
    "stage": "IS",
    "instructor": {
      "_id": "507f1f77bcf86cd799439013",
      "firstName": "Jonas",
      "lastName": "Jonaitis",
      "militaryRank": "Seržantas"
    },
    "participants": [
      {
        "soldier": {
          "_id": "507f1f77bcf86cd799439014",
          "firstName": "Petras",
          "lastName": "Petraitis",
          "militaryRank": "Eilinis"
        },
        "attended": true
      }
    ],
    "unit": "Paramos burys",
    "createdBy": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "admin"
    }
  }
]
```

### POST /exercises

Create new exercise (Admin/Superuser).

**Request:**

```http
POST /api/exercises
Authorization: Bearer <token>
Content-Type: application/json

{
  "taskId": "507f1f77bcf86cd799439020",
  "date": "2024-01-25",
  "duration": 3,
  "stage": "IT",
  "instructor": "507f1f77bcf86cd799439013",
  "participants": [
    {
      "soldier": "507f1f77bcf86cd799439014",
      "attended": true
    },
    {
      "soldier": "507f1f77bcf86cd799439015",
      "attended": false
    }
  ],
  "unit": "Paramos burys"
}
```

**Exercise Stages:**

- `IS`: Initial Stage
- `IT`: Intermediate Training
- `II`: Individual Instruction
- `"-"`: Not Specified

**Response:**

```json
{
  "_id": "507f1f77bcf86cd799439018",
  "taskId": {
    "_id": "507f1f77bcf86cd799439020",
    "name": "Fizinio pasirengimo patikrinimas"
  },
  "date": "2024-01-25T00:00:00.000Z",
  "duration": 3,
  "stage": "IT",
  "instructor": {
    "_id": "507f1f77bcf86cd799439013",
    "firstName": "Jonas",
    "lastName": "Jonaitis",
    "militaryRank": "Seržantas"
  },
  "participants": [
    {
      "soldier": {
        "_id": "507f1f77bcf86cd799439014",
        "firstName": "Petras",
        "lastName": "Petraitis",
        "militaryRank": "Eilinis"
      },
      "attended": true
    }
  ],
  "unit": "Paramos burys"
}
```

### GET /exercises/stats

Get exercise statistics.

**Request:**

```http
GET /api/exercises/stats?unit=Paramos%20burys&startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <token>
```

**Response:**

```json
{
  "totalExercises": 15,
  "totalParticipants": 45,
  "attendanceRate": 87.5,
  "exercisesByTask": {
    "Fizinio pasirengimo patikrinimas": {
      "count": 3,
      "participants": 12,
      "attended": 11,
      "attendanceRate": 91.7
    },
    "Saudymo mokymai": {
      "count": 2,
      "participants": 8,
      "attended": 7,
      "attendanceRate": 87.5
    }
  },
  "exercisesByStage": {
    "IS": 5,
    "IT": 6,
    "II": 3,
    "-": 1
  }
}
```

---

## 📊 Evaluations Endpoints

### GET /evaluations

Get all evaluations with filtering.

**Request:**

```http
GET /api/evaluations?unit=Paramos%20burys&evaluationType=Oficialus&startDate=2024-01-01
Authorization: Bearer <token>
```

**Query Parameters:**

- `unit` (string): Filter by unit
- `evaluationType` (string): "Oficialus" or "Neoficialus"
- `startDate` (string): Start date filter
- `endDate` (string): End date filter

**Response:**

```json
[
  {
    "_id": "507f1f77bcf86cd799439019",
    "date": "2024-01-22T00:00:00.000Z",
    "evaluationType": "Oficialus",
    "taskCode": "TSK-001",
    "taskName": "Fizinio pasirengimo testas",
    "recordedBy": {
      "_id": "507f1f77bcf86cd799439013",
      "firstName": "Jonas",
      "lastName": "Jonaitis",
      "militaryRank": "Seržantas"
    },
    "ratings": [
      {
        "soldier": {
          "_id": "507f1f77bcf86cd799439014",
          "firstName": "Petras",
          "lastName": "Petraitis",
          "militaryRank": "Eilinis"
        },
        "rating": "I"
      },
      {
        "soldier": {
          "_id": "507f1f77bcf86cd799439015",
          "firstName": "Antanas",
          "lastName": "Antanaitis",
          "militaryRank": "Eilinis"
        },
        "rating": "IA"
      }
    ],
    "unit": "Paramos burys",
    "completionPercentage": 85.7,
    "totalPassed": 6,
    "dailyPassed": 6
  }
]
```

### POST /evaluations

Create new evaluation (Admin/Superuser).

**Request:**

```http
POST /api/evaluations
Authorization: Bearer <token>
Content-Type: application/json

{
  "date": "2024-01-23",
  "evaluationType": "Oficialus",
  "taskCode": "TSK-002",
  "taskName": "Saudymo tikslumas",
  "recordedBy": "507f1f77bcf86cd799439013",
  "ratings": [
    {
      "soldier": "507f1f77bcf86cd799439014",
      "rating": "I"
    },
    {
      "soldier": "507f1f77bcf86cd799439015",
      "rating": "NI"
    }
  ],
  "unit": "Paramos burys"
}
```

**Evaluation Types:**

- `Oficialus`: Official evaluation
- `Neoficialus`: Unofficial evaluation

**Rating System:**

- `I`: Įvykdyta (Completed)
- `IA`: Įvykdyta Atsižvelgiant (Completed with Consideration)
- `NI`: Neįvykdyta (Not Completed)
- `"-"`: Nevertinama (Not Evaluated)

**Response:**

```json
{
  "_id": "507f1f77bcf86cd799439021",
  "date": "2024-01-23T00:00:00.000Z",
  "evaluationType": "Oficialus",
  "taskCode": "TSK-002",
  "taskName": "Saudymo tikslumas",
  "recordedBy": {
    "_id": "507f1f77bcf86cd799439013",
    "firstName": "Jonas",
    "lastName": "Jonaitis",
    "militaryRank": "Seržantas"
  },
  "ratings": [
    {
      "soldier": {
        "_id": "507f1f77bcf86cd799439014",
        "firstName": "Petras",
        "lastName": "Petraitis",
        "militaryRank": "Eilinis"
      },
      "rating": "I"
    }
  ],
  "unit": "Paramos burys",
  "completionPercentage": 50.0,
  "totalPassed": 1,
  "dailyPassed": 1
}
```

### GET /evaluations/stats

Get evaluation statistics.

**Request:**

```http
GET /api/evaluations/stats?unit=Paramos%20burys&startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <token>
```

**Response:**

```json
{
  "totalEvaluations": 8,
  "officialCount": 5,
  "unofficialCount": 3,
  "passingRate": 78.5,
  "ratingDistribution": {
    "I": 25,
    "IA": 8,
    "NI": 5,
    "-": 2
  },
  "taskPerformance": {
    "Fizinio pasirengimo testas": {
      "total": 15,
      "passed": 12,
      "passRate": 80.0
    },
    "Saudymo tikslumas": {
      "total": 10,
      "passed": 7,
      "passRate": 70.0
    }
  }
}
```

---

## 📋 Tasks Endpoints

### GET /tasks

Get all tasks with optional filtering.

**Request:**

```http
GET /api/tasks?type=Individualios
Authorization: Bearer <token>
```

**Query Parameters:**

- `type` (string): "Individualios" or "Kolektyvines"

**Response:**

```json
[
  {
    "_id": "507f1f77bcf86cd799439020",
    "name": "Fizinio pasirengimo patikrinimas",
    "description": "Metinis fizinio pasirengimo testas",
    "type": "Individualios",
    "createdBy": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "admin"
    },
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
]
```

### POST /tasks

Create new task (Admin/Superuser).

**Request:**

```http
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Komandinio darbo mokymai",
  "description": "Komandinio bendradarbiavimo įgūdžių ugdymas",
  "type": "Kolektyvines"
}
```

**Task Types:**

- `Individualios`: Individual tasks
- `Kolektyvines`: Collective/team tasks

**Response:**

```json
{
  "_id": "507f1f77bcf86cd799439022",
  "name": "Komandinio darbo mokymai",
  "description": "Komandinio bendradarbiavimo įgūdžių ugdymas",
  "type": "Kolektyvines",
  "createdBy": "507f1f77bcf86cd799439011",
  "createdAt": "2024-01-23T14:30:00.000Z"
}
```

---

## 🏢 Structural Units Endpoints

### GET /structural-units

Get all structural units.

**Request:**

```http
GET /api/structural-units?parentUnit=Rysiu%20ir%20informaciniu%20sistemu%20burys&active=true
Authorization: Bearer <token>
```

**Query Parameters:**

- `parentUnit` (string): Filter by parent unit
- `active` (boolean): Filter by active status

**Response:**

```json
[
  {
    "_id": "507f1f77bcf86cd799439023",
    "name": "RIS burys",
    "parentUnit": "Rysiu ir informaciniu sistemu burys",
    "active": true,
    "createdAt": "2024-01-15T10:00:00.000Z"
  },
  {
    "_id": "507f1f77bcf86cd799439024",
    "name": "LAN/WAN skyrius",
    "parentUnit": "Rysiu ir informaciniu sistemu burys",
    "active": true,
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
]
```

### POST /structural-units

Create new structural unit (Admin/Superuser).

**Request:**

```http
POST /api/structural-units
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Naujas skyrius",
  "parentUnit": "Paramos burys",
  "active": true
}
```

**Response:**

```json
{
  "_id": "507f1f77bcf86cd799439025",
  "name": "Naujas skyrius",
  "parentUnit": "Paramos burys",
  "active": true,
  "createdAt": "2024-01-23T15:00:00.000Z"
}
```

### POST /structural-units/initialize

Initialize default structural units (Admin only).

**Request:**

```http
POST /api/structural-units/initialize
Authorization: Bearer <admin_token>
```

**Response:**

```json
{
  "message": "Default structural units initialized successfully",
  "units": [
    {
      "_id": "507f1f77bcf86cd799439026",
      "name": "RIS burys",
      "parentUnit": "Rysiu ir informaciniu sistemu burys"
    }
  ]
}
```

---

## Data Models

### Complete Schema Definitions

#### User Model

```javascript
{
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    // Hashed with bcrypt
  },
  role: {
    type: String,
    enum: ["admin", "superuser"],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}
```

#### Soldier Model

```javascript
{
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  militaryRank: {
    type: String,
    required: true,
    enum: [
      "Jaunesnysis Eilinis", "Eilinis", "Vyresnysis Eilinis",
      "Grandinis", "Seržantas", "Vyresnysis Seržantas",
      "Štabo Seržantas", "Viršila", "Seržantas Majoras",
      "Leitenаntas", "Vyr. leitenаntas", "Kapitonas",
      "Majoras", "Pulkininkas Leitenantas", "Pulkininkas"
    ]
  },
  joinDate: {
    type: Date,
    required: true
  },
  primaryUnit: {
    type: String,
    required: true,
    enum: [
      "Paramos burys",
      "Rysiu ir informaciniu sistemu burys",
      "Valdymo grupe"
    ]
  },
  subUnit: {
    type: String,
    // Required only for "Rysiu ir informaciniu sistemu burys"
    enum: [
      "RIS burys", "LAN/WAN skyrius", "Videotelekonferencijos skyrius",
      "Laidinio rysio skyrius", "Kompiuteriniui tinklu skyrius",
      "1 rysiu skyrius", "2 rysiu skyrius", "Vartotoju aptarnavimo skyrius"
    ]
  },
  active: {
    type: Boolean,
    default: true
  }
}
```

#### Attendance Model

```javascript
{
  date: {
    type: Date,
    required: true
  },
  soldier: {
    type: ObjectId,
    ref: "Soldier",
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ["Present", "Absent", "Sick", "Leave", "Mission", "Other"]
  },
  reason: {
    type: String,
    trim: true
    // Required when status !== "Present"
  },
  unit: {
    type: String,
    required: true,
    enum: ["Paramos burys", "Rysiu ir informaciniu sistemu burys", "Valdymo grupe"]
  },
  createdBy: {
    type: ObjectId,
    ref: "User",
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}

// Compound unique index on date + soldier
Index: { date: 1, soldier: 1 }, { unique: true }
```

#### Exercise Model

```javascript
{
  taskId: {
    type: ObjectId,
    ref: "Task",
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  duration: {
    type: Number, // Hours
    required: true
  },
  stage: {
    type: String,
    enum: ["IS", "IT", "II", "-"],
    required: true
  },
  instructor: {
    type: ObjectId,
    ref: "Soldier",
    required: true
  },
  participants: [{
    soldier: {
      type: ObjectId,
      ref: "Soldier",
      required: true
    },
    attended: {
      type: Boolean,
      default: false
    }
  }],
  unit: {
    type: String,
    required: true,
    enum: ["Paramos burys", "Rysiu ir informaciniu sistemu burys", "Valdymo grupe"]
  },
  createdBy: {
    type: ObjectId,
    ref: "User",
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}
```

#### Evaluation Model

```javascript
{
  date: {
    type: Date,
    required: true
  },
  evaluationType: {
    type: String,
    enum: ["Oficialus", "Neoficialus"],
    required: true
  },
  taskCode: {
    type: String,
    required: true,
    trim: true
  },
  taskName: {
    type: String,
    required: true,
    trim: true
  },
  recordedBy: {
    type: ObjectId,
    ref: "Soldier",
    required: true
  },
  ratings: [{
    soldier: {
      type: ObjectId,
      ref: "Soldier",
      required: true
    },
    rating: {
      type: String,
      enum: ["I", "IA", "NI", "-"],
      required: true
    }
  }],
  unit: {
    type: String,
    required: true,
    enum: ["Paramos burys", "Rysiu ir informaciniu sistemu burys", "Valdymo grupe"]
  },
  completionPercentage: {
    type: Number,
    default: 0 // Calculated automatically
  },
  totalPassed: {
    type: Number,
    default: 0 // Calculated automatically
  },
  dailyPassed: {
    type: Number,
    default: 0 // Calculated automatically
  },
  createdBy: {
    type: ObjectId,
    ref: "User",
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}
```

#### Task Model

```javascript
{
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ["Individualios", "Kolektyvines"]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: ObjectId,
    ref: "User",
    required: true
  }
}
```

#### Structural Unit Model

```javascript
{
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  parentUnit: {
    type: String,
    required: true,
    enum: ["Paramos burys", "Rysiu ir informaciniu sistemu burys", "Valdymo grupe"]
  },
  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}
```

---

## Query Parameters & Filtering

### Common Query Parameters

All list endpoints support these common parameters:

#### Date Filtering

```http
# Single date
GET /api/attendance?date=2024-01-15

# Date range
GET /api/exercises?startDate=2024-01-01&endDate=2024-01-31

# Start date only (from date onwards)
GET /api/evaluations?startDate=2024-01-01

# End date only (up to date)
GET /api/attendance?endDate=2024-01-31
```

#### Unit Filtering

```http
# Filter by primary unit
GET /api/soldiers?primaryUnit=Paramos%20burys

# Filter by sub unit
GET /api/soldiers?subUnit=RIS%20burys

# Filter by unit (for attendance, exercises, evaluations)
GET /api/attendance?unit=Valdymo%20grupe
```

#### Status Filtering

```http
# Attendance status
GET /api/attendance?status=Present

# Active/inactive soldiers
GET /api/soldiers?active=true

# Evaluation type
GET /api/evaluations?evaluationType=Oficialus
```

### Advanced Filtering Examples

#### Complex Attendance Query

```http
GET /api/attendance?unit=Paramos%20burys&status=Absent&startDate=2024-01-01&endDate=2024-01-31&soldier=507f1f77bcf86cd799439013
```

Returns: All absence records for specific soldier in Paramos burys during January 2024

#### Exercise Participation Analysis

```http
GET /api/exercises?unit=Rysiu%20ir%20informaciniu%20sistemu%20burys&startDate=2024-01-01&endDate=2024-03-31
```

Returns: All exercises for RIS unit in Q1 2024

#### Evaluation Performance Review

```http
GET /api/evaluations?evaluationType=Oficialus&startDate=2024-01-01&endDate=2024-12-31
```

Returns: All official evaluations for the year 2024

### Response Pagination

For large datasets, implement pagination:

```http
GET /api/soldiers?page=1&limit=50&primaryUnit=Paramos%20burys
```

**Response includes pagination metadata:**

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 156,
    "pages": 4,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## Error Handling

### HTTP Status Codes

| Code | Description           | Usage                                 |
| ---- | --------------------- | ------------------------------------- |
| 200  | OK                    | Successful GET, PUT requests          |
| 201  | Created               | Successful POST requests              |
| 400  | Bad Request           | Validation errors, malformed requests |
| 401  | Unauthorized          | Missing or invalid authentication     |
| 403  | Forbidden             | Insufficient permissions              |
| 404  | Not Found             | Resource doesn't exist                |
| 409  | Conflict              | Duplicate resource creation           |
| 422  | Unprocessable Entity  | Validation errors with details        |
| 500  | Internal Server Error | Server-side errors                    |

### Error Response Format

All errors return consistent JSON format:

```json
{
  "message": "Error description",
  "error": "ErrorType", // Optional
  "details": {...}, // Optional, for validation errors
  "timestamp": "2024-01-23T15:30:00.000Z",
  "path": "/api/soldiers"
}
```

### Common Error Scenarios

#### Authentication Errors

```json
// 401 - Missing token
{
  "message": "Not authorized to access this route"
}

// 401 - Invalid token
{
  "message": "Invalid token. Please log in again"
}

// 401 - Expired token
{
  "message": "Your token has expired! Please log in again"
}
```

#### Authorization Errors

```json
// 403 - Insufficient permissions
{
  "message": "Access denied: Admin privileges required"
}

// 403 - Role-based restriction
{
  "message": "Access denied: Admin or Superuser privileges required"
}
```

#### Validation Errors

```json
// 400 - Missing required fields
{
  "message": "Missing required fields: firstName, lastName",
  "details": {
    "firstName": "First name is required",
    "lastName": "Last name is required"
  }
}

// 400 - Invalid enum value
{
  "message": "Invalid military rank provided",
  "details": {
    "militaryRank": "Must be one of: Eilinis, Seržantas, Kapitonas..."
  }
}
```

#### Resource Errors

```json
// 404 - Resource not found
{
  "message": "Soldier not found"
}

// 409 - Duplicate resource
{
  "message": "A soldier with this name already exists in the unit"
}

// 400 - Business logic violation
{
  "message": "Sub-unit is required when primary unit is 'Rysiu ir informaciniu sistemu burys'"
}
```

#### Database Errors

```json
// 500 - Database connection error
{
  "message": "Database connection failed",
  "error": "MongoNetworkError"
}

// 500 - Validation error at database level
{
  "message": "Database validation failed",
  "details": {
    "code": 11000,
    "keyPattern": { "date": 1, "soldier": 1 }
  }
}
```

### Error Handling Best Practices

#### Client-Side Error Handling

```javascript
// Example error handling in frontend
try {
  const response = await fetch("/api/soldiers", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(soldierData),
  });

  if (!response.ok) {
    const error = await response.json();

    switch (response.status) {
      case 400:
        // Handle validation errors
        displayValidationErrors(error.details);
        break;
      case 401:
        // Redirect to login
        redirectToLogin();
        break;
      case 403:
        // Show permission denied message
        showAccessDenied();
        break;
      default:
        // Show generic error
        showError(error.message);
    }
    return;
  }

  const soldier = await response.json();
  // Handle success
} catch (error) {
  // Handle network errors
  showNetworkError();
}
```

#### Server-Side Error Logging

```javascript
// Error logging in controllers
try {
  // Business logic
} catch (error) {
  console.error("Soldier creation failed:", {
    error: error.message,
    stack: error.stack,
    userId: req.user._id,
    requestBody: req.body,
    timestamp: new Date().toISOString(),
  });

  res.status(500).json({
    message: "An error occurred while creating soldier",
  });
}
```

---

## Security

### Security Architecture

```
┌─────────────────┐    HTTPS/TLS     ┌─────────────────┐
│    Frontend     │◄─────────────────►│   Load Balancer │
└─────────────────┘                  └─────────┬───────┘
                                               │
                                     ┌─────────▼───────┐
                                     │   API Gateway   │
                                     │   - Rate Limiting│
                                     │   - CORS        │
                                     │   - Headers     │
                                     └─────────┬───────┘
                                               │
                                     ┌─────────▼───────┐
                                     │  Express.js API │
                                     │  - JWT Auth     │
                                     │  - Input Valid. │
                                     │  - Role-based   │
                                     └─────────┬───────┘
                                               │
                                     ┌─────────▼───────┐
                                     │    MongoDB      │
                                     │  - Encryption   │
                                     │  - Access Control│
                                     └─────────────────┘
```

### Security Features

#### 1. Authentication Security

**JWT Token Security:**

- Strong secret key (minimum 32 characters)
- Token expiration (24 hours default)
- Secure token storage recommendations
- Token invalidation on logout

**Password Security:**

- bcrypt hashing with salt rounds (10)
- Minimum password requirements
- Password change functionality
- Account lockout after failed attempts (recommended)

```javascript
// Password hashing implementation
const bcrypt = require("bcryptjs");

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Password comparison
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
```

#### 2. Authorization Security

**Role-Based Access Control (RBAC):**

- Clear separation between Admin and Superuser roles
- Granular permissions for each endpoint
- Middleware-based permission checking

```javascript
// Permission matrix
const permissions = {
  admin: [
    "users:*",
    "soldiers:*",
    "attendance:*",
    "exercises:*",
    "evaluations:*",
    "tasks:*",
    "units:*",
  ],
  superuser: [
    "soldiers:create,read,update",
    "attendance:create,read,update",
    "exercises:create,read,update",
    "evaluations:create,read,update",
    "tasks:create,read,update",
    "units:create,read,update",
  ],
};
```

#### 3. Input Validation & Sanitization

**Data Validation:**

- MongoDB schema validation
- Custom validation middleware
- Input sanitization to prevent XSS
- SQL injection prevention (NoSQL injection)

```javascript
// Input sanitization example
const validator = require("validator");

const sanitizeInput = (input) => {
  if (typeof input !== "string") return input;
  return validator.escape(input.trim());
};

// Validation middleware
const validateSoldierInput = (req, res, next) => {
  const { firstName, lastName, militaryRank } = req.body;

  // Sanitize inputs
  req.body.firstName = sanitizeInput(firstName);
  req.body.lastName = sanitizeInput(lastName);

  // Validate required fields
  if (!firstName || !lastName || !militaryRank) {
    return res.status(400).json({
      message: "Missing required fields",
    });
  }

  next();
};
```

#### 4. HTTP Security Headers

**Helmet.js Configuration:**

```javascript
const helmet = require("helmet");

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  })
);
```

#### 5. CORS Configuration

```javascript
const cors = require("cors");

const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
```

#### 6. Rate Limiting

```javascript
const rateLimit = require("express-rate-limit");

// General rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP",
});

// Auth rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login attempts per windowMs
  message: "Too many login attempts, please try again later",
});

app.use("/api/auth/login", authLimiter);
app.use("/api", generalLimiter);
```

### Security Checklist

#### Production Deployment Security

- [ ] **Environment Variables**: All secrets in environment variables
- [ ] **HTTPS**: Force HTTPS in production
- [ ] **Database Security**: MongoDB authentication enabled
- [ ] **Firewall**: Restrict database access to application servers only
- [ ] **Logging**: Comprehensive security event logging
- [ ] **Monitoring**: Real-time security monitoring
- [ ] **Backups**: Regular encrypted database backups
- [ ] **Updates**: Keep all dependencies updated

#### Code Security

- [ ] **Input Validation**: All inputs validated and sanitized
- [ ] **Error Handling**: No sensitive information in error messages
- [ ] **Authentication**: Strong JWT secret, proper token expiration
- [ ] **Authorization**: Role-based access control implemented
- [ ] **Password Security**: bcrypt with appropriate salt rounds
- [ ] **SQL Injection**: Parameterized queries (MongoDB safe by default)
- [ ] **XSS Prevention**: Input sanitization and CSP headers

---

## Logging & Monitoring

### Logging System

#### Log Levels

- **ERROR**: System errors, exceptions, critical issues
- **WARN**: Warning conditions, deprecated usage
- **INFO**: General information, request logs
- **DEBUG**: Detailed information for debugging (development only)

#### Log Format

```javascript
// Custom logger implementation
const winston = require("winston");

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),
    new winston.transports.File({
      filename: "logs/combined.log",
    }),
  ],
});

// Console logging in development
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}
```

#### Request Logging

```javascript
// Morgan middleware for HTTP request logging
const morgan = require("morgan");

// Custom token for user ID
morgan.token("user", (req) => {
  return req.user ? req.user._id : "anonymous";
});

// Custom format
const logFormat =
  ":method :url :status :res[content-length] - :response-time ms :user";

app.use(
  morgan(logFormat, {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);
```

#### Security Event Logging

```javascript
// Authentication events
const logAuthEvent = (event, user, req, success = true) => {
  logger.info("Authentication Event", {
    event,
    userId: user?._id,
    username: user?.username,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
    success,
    timestamp: new Date().toISOString(),
  });
};

// Usage examples
logAuthEvent("LOGIN_ATTEMPT", null, req, false);
logAuthEvent("LOGIN_SUCCESS", user, req, true);
logAuthEvent("TOKEN_EXPIRED", user, req, false);
```

### Monitoring Setup

#### Health Check Endpoint

```javascript
// Health check route
app.get("/health", async (req, res) => {
  try {
    // Check database connection
    await mongoose.connection.db.admin().ping();

    res.status(200).json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      environment: process.env.NODE_ENV,
    });
  } catch (error) {
    res.status(503).json({
      status: "unhealthy",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});
```

#### Performance Monitoring

```javascript
// Response time monitoring
app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;

    // Log slow requests
    if (duration > 1000) {
      logger.warn("Slow Request", {
        method: req.method,
        url: req.url,
        duration,
        statusCode: res.statusCode,
      });
    }
  });

  next();
});
```

#### Database Monitoring

```javascript
// MongoDB connection monitoring
mongoose.connection.on("connected", () => {
  logger.info("MongoDB connected successfully");
});

mongoose.connection.on("error", (error) => {
  logger.error("MongoDB connection error", { error: error.message });
});

mongoose.connection.on("disconnected", () => {
  logger.warn("MongoDB disconnected");
});
```

---

## Testing

### Test Structure

```
tests/
├── unit/                 # Unit tests
│   ├── models/          # Model tests
│   ├── controllers/     # Controller tests
│   ├── middleware/      # Middleware tests
│   └── utils/          # Utility function tests
├── integration/         # Integration tests
│   ├── auth.test.js    # Authentication flow tests
│   ├── soldiers.test.js # Soldier CRUD tests
│   └── attendance.test.js # Attendance tests
├── e2e/                # End-to-end tests
│   └── api.test.js     # Full API workflow tests
├── fixtures/           # Test data
│   └── sampleData.js
└── setup/              # Test configuration
    ├── testDb.js       # Test database setup
    └── helpers.js      # Test helper functions
```

### Unit Tests Examples

#### Model Tests

```javascript
// tests/unit/models/soldier.test.js
const mongoose = require("mongoose");
const Soldier = require("../../../src/models/soldier");

describe("Soldier Model", () => {
  beforeEach(async () => {
    await Soldier.deleteMany({});
  });

  describe("Validation", () => {
    it("should create valid soldier", async () => {
      const soldierData = {
        firstName: "Jonas",
        lastName: "Jonaitis",
        militaryRank: "Seržantas",
        joinDate: new Date("2023-01-15"),
        primaryUnit: "Paramos burys",
        active: true,
      };

      const soldier = new Soldier(soldierData);
      const savedSoldier = await soldier.save();

      expect(savedSoldier._id).toBeDefined();
      expect(savedSoldier.firstName).toBe("Jonas");
    });

    it("should require subUnit for RIS unit", async () => {
      const soldierData = {
        firstName: "Petras",
        lastName: "Petraitis",
        militaryRank: "Eilinis",
        joinDate: new Date("2023-01-15"),
        primaryUnit: "Rysiu ir informaciniu sistemu burys",
        // Missing subUnit
      };

      const soldier = new Soldier(soldierData);

      await expect(soldier.save()).rejects.toThrow();
    });
  });
});
```

#### Controller Tests

```javascript
// tests/unit/controllers/soldiers.test.js
const request = require("supertest");
const app = require("../../../src/server");
const Soldier = require("../../../src/models/soldier");
const { generateToken } = require("../../setup/helpers");

describe("Soldiers Controller", () => {
  let authToken;
  let adminToken;

  beforeEach(async () => {
    authToken = generateToken({ _id: "user1", role: "superuser" });
    adminToken = generateToken({ _id: "admin1", role: "admin" });
    await Soldier.deleteMany({});
  });

  describe("GET /api/soldiers", () => {
    it("should return soldiers for authenticated user", async () => {
      // Create test soldier
      await Soldier.create({
        firstName: "Jonas",
        lastName: "Jonaitis",
        militaryRank: "Seržantas",
        joinDate: new Date("2023-01-15"),
        primaryUnit: "Paramos burys",
      });

      const response = await request(app)
        .get("/api/soldiers")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].firstName).toBe("Jonas");
    });

    it("should return 401 for unauthenticated request", async () => {
      await request(app).get("/api/soldiers").expect(401);
    });
  });

  describe("POST /api/soldiers", () => {
    it("should create soldier with valid data", async () => {
      const soldierData = {
        firstName: "Petras",
        lastName: "Petraitis",
        militaryRank: "Eilinis",
        joinDate: "2023-01-15",
        primaryUnit: "Paramos burys",
      };

      const response = await request(app)
        .post("/api/soldiers")
        .set("Authorization", `Bearer ${authToken}`)
        .send(soldierData)
        .expect(201);

      expect(response.body.firstName).toBe("Petras");
      expect(response.body._id).toBeDefined();
    });
  });
});
```

### Integration Tests

```javascript
// tests/integration/auth.test.js
const request = require("supertest");
const app = require("../../src/server");
const User = require("../../src/models/user");

describe("Authentication Integration", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    // Create test user
    await User.create({
      username: "testuser",
      password: "password123",
      role: "superuser",
    });
  });

  describe("Login Flow", () => {
    it("should complete full login flow", async () => {
      // Login
      const loginResponse = await request(app)
        .post("/api/auth/login")
        .send({
          username: "testuser",
          password: "password123",
        })
        .expect(200);

      expect(loginResponse.body.token).toBeDefined();
      expect(loginResponse.body.username).toBe("testuser");

      // Use token to access protected route
      const protectedResponse = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${loginResponse.body.token}`)
        .expect(200);

      expect(protectedResponse.body.username).toBe("testuser");
    });
  });
});
```

### Test Configuration

#### Test Database Setup

```javascript
// tests/setup/testDb.js
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;

const connectTestDB = async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  await mongoose.connect(mongoUri);
};

const disconnectTestDB = async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
};

const clearTestDB = async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    await collections[key].deleteMany({});
  }
};

module.exports = {
  connectTestDB,
  disconnectTestDB,
  clearTestDB,
};
```

#### Test Helpers

```javascript
// tests/setup/helpers.js
const jwt = require("jsonwebtoken");

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET || "test-secret", {
    expiresIn: "1h",
  });
};

const createTestSoldier = (overrides = {}) => {
  return {
    firstName: "Test",
    lastName: "Soldier",
    militaryRank: "Eilinis",
    joinDate: new Date("2023-01-15"),
    primaryUnit: "Paramos burys",
    active: true,
    ...overrides,
  };
};

module.exports = {
  generateToken,
  createTestSoldier,
};
```

### Running Tests

#### Package.json Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:unit": "jest tests/unit",
    "test:integration": "jest tests/integration",
    "test:e2e": "jest tests/e2e"
  }
}
```

#### Jest Configuration

```javascript
// jest.config.js
module.exports = {
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/tests/setup/jest.setup.js"],
  testMatch: ["**/tests/**/*.test.js"],
  collectCoverageFrom: ["src/**/*.js", "!src/server.js", "!src/seeder.js"],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
};
```

---

## Deployment

### Production Environment Setup

#### 1. Server Requirements

**Minimum Requirements:**

- **CPU**: 2 vCPUs
- **RAM**: 4GB
- **Storage**: 20GB SSD
- **Network**: 1 Gbps

**Recommended Requirements:**

- **CPU**: 4 vCPUs
- **RAM**: 8GB
- **Storage**: 50GB SSD
- **Network**: 1 Gbps

#### 2. Environment Configuration

**Production .env:**

```env
# Server Configuration
NODE_ENV=production
PORT=5000

# Database Configuration
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/prism?retryWrites=true&w=majority

# Security Configuration
JWT_SECRET=your_super_secure_32_character_plus_secret_key_here_random_string
JWT_EXPIRE=24h

# CORS Configuration
FRONTEND_URL=https://yourdomain.com

# Logging
LOG_LEVEL=info

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### 3. Database Setup

**MongoDB Atlas (Recommended):**

```javascript
// Connection with production options
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4,
  retryWrites: true,
  w: "majority",
};

mongoose.connect(process.env.MONGO_URI, mongoOptions);
```

**Self-hosted MongoDB:**

```bash
# MongoDB configuration for production
# /etc/mongod.conf

storage:
  dbPath: /var/lib/mongodb
  journal:
    enabled: true

systemLog:
  destination: file
  logAppend: true
  path: /var/log/mongodb/mongod.log

net:
  port: 27017
  bindIp: 127.0.0.1

security:
  authorization: enabled

processManagement:
  fork: true
  pidFilePath: /var/run/mongodb/mongod.pid
```

#### 4. Process Management with PM2

**Installation:**

```bash
npm install -g pm2
```

**PM2 Configuration:**

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: "prism-api",
      script: "src/server.js",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "development",
        PORT: 5000,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 5000,
      },
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      log_file: "./logs/combined.log",
      time: true,
      max_memory_restart: "1G",
      node_args: "--max_old_space_size=1024",
    },
  ],
};
```

**PM2 Commands:**

```bash
# Start application
pm2 start ecosystem.config.js --env production

# Monitor application
pm2 monit

# View logs
pm2 logs prism-api

# Restart application
pm2 restart prism-api

# Stop application
pm2 stop prism-api

# Save PM2 configuration
pm2 save

# Setup PM2 startup script
pm2 startup
```

#### 5. Nginx Reverse Proxy

**Nginx Configuration:**

```nginx
# /etc/nginx/sites-available/prism-api
server {
    listen 80;
    server_name api.yourdomain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    # SSL Configuration
    ssl_certificate /path/to/ssl/certificate.crt;
    ssl_certificate_key /path/to/ssl/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;

    # Security Headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";

    # Proxy Configuration
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Rate Limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req zone=api burst=20 nodelay;

    # Logging
    access_log /var/log/nginx/prism-api.access.log;
    error_log /var/log/nginx/prism-api.error.log;
}
```

#### 6. SSL Certificate Setup

**Using Let's Encrypt:**

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d api.yourdomain.com

# Auto-renewal setup
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

#### 7. Firewall Configuration

**UFW (Ubuntu Firewall):**

```bash
# Allow SSH
sudo ufw allow ssh

# Allow HTTP and HTTPS
sudo ufw allow 'Nginx Full'

# Allow MongoDB (if self-hosted)
sudo ufw allow from your_app_server_ip to any port 27017

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

#### 8. Monitoring & Alerting

**Log Rotation:**

```bash
# /etc/logrotate.d/prism-api
/path/to/prism/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        pm2 reloadLogs
    endscript
}
```

**Health Monitoring Script:**

```bash
#!/bin/bash
# health-check.sh

API_URL="https://api.yourdomain.com/health"
EMAIL="admin@yourdomain.com"

response=$(curl -s -w "\n%{http_code}" "$API_URL")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n -1)

if [ "$http_code" != "200" ]; then
    echo "API Health Check Failed - HTTP $http_code" | \
    mail -s "PRISM API Down" "$EMAIL"
fi

# Add to crontab: */5 * * * * /path/to/health-check.sh
```

### Deployment Automation

#### GitHub Actions CI/CD

```yaml
# .github/workflows/deploy.yml
name: Deploy PRISM API

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      mongodb:
        image: mongo:4.4
        ports:
          - 27017:27017

    steps:
      - uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: "16"

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test
        env:
          MONGO_URI: mongodb://localhost:27017/prism_test
          JWT_SECRET: test_secret_key_for_ci

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v2

      - name: Deploy to server
        uses: appleboy/ssh-action@v0.1.5
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /path/to/prism-api
            git pull origin main
            npm install --production
            pm2 restart prism-api
```

#### Docker Deployment

**Dockerfile:**

```dockerfile
FROM node:16-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY src/ ./src/

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership
RUN chown -R nodejs:nodejs /usr/src/app
USER nodejs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

# Start application
CMD ["node", "src/server.js"]
```

**Docker Compose:**

```yaml
# docker-compose.yml
version: "3.8"

services:
  api:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGO_URI=mongodb://mongo:27017/prism
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - mongo
    restart: unless-stopped

  mongo:
    image: mongo:4.4
    volumes:
      - mongo_data:/data/db
    environment:
      - MONGO_INITDB_ROOT_USERNAME=${MONGO_USERNAME}
      - MONGO_INITDB_ROOT_PASSWORD=${MONGO_PASSWORD}
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl
    depends_on:
      - api
    restart: unless-stopped

volumes:
  mongo_data:
```

---

## Development Guidelines

### Code Style & Standards

#### ESLint Configuration

```javascript
// .eslintrc.js
module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true,
  },
  extends: ["eslint:recommended"],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  rules: {
    indent: ["error", 2],
    "linebreak-style": ["error", "unix"],
    quotes: ["error", "single"],
    semi: ["error", "always"],
    "no-console": "warn",
    "no-unused-vars": "error",
    "prefer-const": "error",
  },
};
```

#### Prettier Configuration

```javascript
// .prettierrc.js
module.exports = {
  semi: true,
  trailingComma: "es5",
  singleQuote: true,
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
};
```

### Git Workflow

#### Branch Naming Convention

```
main                    # Production branch
develop                 # Development branch
feature/feature-name    # Feature branches
bugfix/bug-description  # Bug fix branches
hotfix/critical-fix     # Critical production fixes
release/version-number  # Release preparation
```

#### Commit Message Format

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**

```
feat(auth): add password reset functionality

fix(soldiers): resolve validation error for RIS sub-units

docs(api): update authentication endpoint documentation

test(attendance): add integration tests for bulk operations
```

### Code Review Guidelines

#### Review Checklist

**Functionality:**

- [ ] Code works as intended
- [ ] All requirements are met
- [ ] Edge cases are handled
- [ ] Error conditions are managed

**Security:**

- [ ] No sensitive data exposed
- [ ] Input validation implemented
- [ ] Authentication/authorization correct
- [ ] SQL injection prevention

**Performance:**

- [ ] No unnecessary database queries
- [ ] Efficient algorithms used
- [ ] Memory usage optimized
- [ ] Response times acceptable

**Code Quality:**

- [ ] Code is readable and maintainable
- [ ] Proper error handling
- [ ] Consistent naming conventions
- [ ] Adequate documentation

**Testing:**

- [ ] Unit tests included
- [ ] Integration tests where needed
- [ ] Test coverage adequate
- [ ] All tests passing

### API Design Principles

#### RESTful Design

**Resource Naming:**

```
GET    /api/soldiers           # Get all soldiers
GET    /api/soldiers/123       # Get specific soldier
POST   /api/soldiers           # Create new soldier
PUT    /api/soldiers/123       # Update soldier
DELETE /api/soldiers/123       # Delete soldier
```

**Nested Resources:**

```
GET    /api/soldiers/123/attendance      # Get soldier's attendance
POST   /api/exercises/456/participants   # Add exercise participants
```

#### Response Format Standards

**Success Response:**

```json
{
  "data": {...},
  "message": "Success message",
  "timestamp": "2024-01-23T15:30:00.000Z"
}
```

**Error Response:**

```json
{
  "error": "Error type",
  "message": "Human readable message",
  "details": {...},
  "timestamp": "2024-01-23T15:30:00.000Z"
}
```

**List Response with Pagination:**

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 156,
    "pages": 8
  }
}
```

### Documentation Standards

#### Code Documentation

```javascript
/**
 * Create a new soldier record
 *
 * @async
 * @function createSoldier
 * @param {Object} req - Express request object
 * @param {Object} req.body - Soldier data
 * @param {string} req.body.firstName - Soldier's first name
 * @param {string} req.body.lastName - Soldier's last name
 * @param {string} req.body.militaryRank - Military rank
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Created soldier object
 * @throws {400} Validation error
 * @throws {409} Duplicate soldier
 *
 * @example
 * POST /api/soldiers
 * {
 *   "firstName": "Jonas",
 *   "lastName": "Jonaitis",
 *   "militaryRank": "Seržantas",
 *   "primaryUnit": "Paramos burys"
 * }
 */
const createSoldier = async (req, res) => {
  // Implementation
};
```

#### API Endpoint Documentation

```javascript
/**
 * @api {post} /soldiers Create Soldier
 * @apiName CreateSoldier
 * @apiGroup Soldiers
 * @apiVersion 1.0.0
 *
 * @apiDescription Create a new soldier record in the system
 *
 * @apiPermission admin, superuser
 *
 * @apiHeader {String} Authorization Bearer JWT token
 *
 * @apiParam {String} firstName Soldier's first name (2-50 chars)
 * @apiParam {String} lastName Soldier's last name (2-50 chars)
 * @apiParam {String} militaryRank Military rank from predefined list
 * @apiParam {Date} joinDate Join date (cannot be future)
 * @apiParam {String} primaryUnit Primary unit assignment
 * @apiParam {String} [subUnit] Sub unit (required for RIS)
 * @apiParam {Boolean} [active=true] Active status
 *
 * @apiSuccess {String} _id Soldier ID
 * @apiSuccess {String} firstName Soldier's first name
 * @apiSuccess {String} lastName Soldier's last name
 * @apiSuccess {String} militaryRank Military rank
 * @apiSuccess {Date} joinDate Join date
 * @apiSuccess {String} primaryUnit Primary unit
 * @apiSuccess {String} subUnit Sub unit
 * @apiSuccess {Boolean} active Active status
 *
 * @apiError (400) ValidationError Invalid input data
 * @apiError (401) Unauthorized Missing or invalid token
 * @apiError (403) Forbidden Insufficient permissions
 * @apiError (409) Conflict Duplicate soldier
 */
```

---

## Troubleshooting

### Common Issues

#### 1. Database Connection Issues

**Problem:** `MongoNetworkError: connect ECONNREFUSED`

**Solutions:**

```bash
# Check MongoDB status
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod

# Check connection string
echo $MONGO_URI

# Test connection
mongosh $MONGO
```

**Debug Steps:**

```javascript
// Add connection debugging
mongoose.connection.on("error", (error) => {
  console.error("MongoDB Error:", error);
  process.exit(1);
});

mongoose.connection.on("connected", () => {
  console.log("MongoDB connected successfully");
});
```

#### 2. Authentication Issues

**Problem:** `401 Unauthorized` errors

**Diagnosis:**

```javascript
// Debug JWT token
const jwt = require("jsonwebtoken");

const debugToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token valid:", decoded);
    return decoded;
  } catch (error) {
    console.log("Token error:", error.message);
    return null;
  }
};

// Check token expiration
const isTokenExpired = (token) => {
  try {
    const decoded = jwt.decode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
};
```

**Solutions:**

- Verify JWT_SECRET is correct
- Check token format in Authorization header
- Ensure token hasn't expired
- Verify user still exists in database

#### 3. Validation Errors

**Problem:** Mongoose validation failures

**Common Validation Issues:**

```javascript
// Sub-unit validation for RIS
if (primaryUnit === 'Rysiu ir informaciniu sistemu burys' && !subUnit) {
  throw new Error('Sub-unit required for RIS');
}

// Date validation
if (new Date(joinDate) > new Date()) {
  throw new Error('Join date cannot be in future');
}

// Military rank validation
const validRanks = ['Eilinis', 'Seržantas', 'Kapitonas', ...];
if (!validRanks.includes(militaryRank)) {
  throw new Error('Invalid military rank');
}
```

#### 4. Performance Issues

**Problem:** Slow API responses

**Diagnosis:**

```javascript
// Add request timing middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (duration > 1000) {
      console.log(`Slow request: ${req.method} ${req.url} - ${duration}ms`);
    }
  });
  next();
});

// Check database queries
mongoose.set("debug", true); // Enable in development only
```

**Solutions:**

- Add database indexes
- Optimize populate queries
- Implement pagination
- Use aggregation pipelines for complex queries

**Database Indexes:**

```javascript
// Add indexes for common queries
soldierSchema.index({ primaryUnit: 1, active: 1 });
attendanceSchema.index({ date: 1, unit: 1 });
exerciseSchema.index({ date: 1, unit: 1 });
evaluationSchema.index({ date: 1, evaluationType: 1 });
```

#### 5. Memory Issues

**Problem:** High memory usage or memory leaks

**Diagnosis:**

```javascript
// Monitor memory usage
setInterval(() => {
  const used = process.memoryUsage();
  console.log("Memory usage:", {
    rss: Math.round(used.rss / 1024 / 1024) + "MB",
    heapTotal: Math.round(used.heapTotal / 1024 / 1024) + "MB",
    heapUsed: Math.round(used.heapUsed / 1024 / 1024) + "MB",
  });
}, 30000);
```

**Solutions:**

- Close database connections properly
- Avoid storing large objects in memory
- Use streaming for large data sets
- Implement proper garbage collection

#### 6. CORS Issues

**Problem:** Cross-origin request blocked

**Diagnosis:**

```javascript
// Debug CORS
app.use((req, res, next) => {
  console.log("Origin:", req.headers.origin);
  console.log("CORS headers:", {
    "Access-Control-Allow-Origin": res.get("Access-Control-Allow-Origin"),
    "Access-Control-Allow-Methods": res.get("Access-Control-Allow-Methods"),
    "Access-Control-Allow-Headers": res.get("Access-Control-Allow-Headers"),
  });
  next();
});
```

**Solutions:**

```javascript
// Proper CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = ["http://localhost:3000", "https://yourdomain.com"];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
```

### Debug Tools & Commands

#### MongoDB Debug Commands

```bash
# Connect to MongoDB
mongosh "mongodb://localhost:27017/prism"

# Show collections
show collections

# Count documents
db.soldiers.countDocuments()
db.attendance.countDocuments()

# Find specific documents
db.soldiers.find({ primaryUnit: "Paramos burys" })
db.attendance.find({ date: ISODate("2024-01-15") })

# Check indexes
db.soldiers.getIndexes()

# Explain query performance
db.soldiers.find({ primaryUnit: "Paramos burys" }).explain("executionStats")

# Drop and recreate database (development only)
db.dropDatabase()
```

#### Node.js Debug Commands

```bash
# Start with debugging
node --inspect src/server.js

# Start with debugging and break on start
node --inspect-brk src/server.js

# Memory profiling
node --prof src/server.js

# Process profiling output
node --prof-process isolate-*.log > profile.txt

# Heap snapshot
node --heapsnapshot-signal=SIGUSR2 src/server.js
```

#### PM2 Debug Commands

```bash
# View application logs
pm2 logs prism-api

# Monitor real-time metrics
pm2 monit

# Restart with zero downtime
pm2 reload prism-api

# Show detailed application info
pm2 show prism-api

# Reset restart counter
pm2 reset prism-api

# Save current PM2 configuration
pm2 save

# Resurrect saved configuration
pm2 resurrect
```

### Logging for Debugging

#### Enhanced Error Logging

```javascript
// Enhanced error middleware
const errorHandler = (err, req, res, next) => {
  console.error("Error Details:", {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    headers: req.headers,
    body: req.body,
    user: req.user?._id,
    timestamp: new Date().toISOString(),
  });

  // Don't leak error details in production
  const message =
    process.env.NODE_ENV === "production"
      ? "Internal server error"
      : err.message;

  res.status(err.statusCode || 500).json({
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
```

#### Request/Response Logging

```javascript
// Detailed request logging
app.use((req, res, next) => {
  const startTime = Date.now();

  // Log request
  console.log("Request:", {
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body,
    user: req.user?._id,
    ip: req.ip,
    timestamp: new Date().toISOString(),
  });

  // Log response
  const originalSend = res.send;
  res.send = function (data) {
    console.log("Response:", {
      statusCode: res.statusCode,
      duration: Date.now() - startTime,
      contentLength: data?.length,
      timestamp: new Date().toISOString(),
    });

    originalSend.call(this, data);
  };

  next();
});
```

---

## Appendix

### A. Military Ranks Hierarchy

```
Officers:
├── Pulkininkas (Colonel)
├── Pulkininkas Leitenantas (Lieutenant Colonel)
├── Majoras (Major)
├── Kapitonas (Captain)
├── Vyr. leitenаntas (Senior Lieutenant)
└── Leitenаntas (Lieutenant)

Non-Commissioned Officers:
├── Seržantas Majoras (Sergeant Major)
├── Viršila (Master Sergeant)
├── Štabo Seržantas (Staff Sergeant)
├── Vyresnysis Seržantas (Senior Sergeant)
├── Seržantas (Sergeant)
└── Grandinis (Corporal)

Enlisted Personnel:
├── Vyresnysis Eilinis (Senior Private)
├── Eilinis (Private)
└── Jaunesnysis Eilinis (Junior Private)
```

### B. Organizational Structure

```
Lithuanian Armed Forces Unit Structure:

Primary Units:
├── Paramos burys (Support Unit)
├── Rysiu ir informaciniu sistemu burys (Communications & IT Unit)
│   ├── RIS burys (CIS Unit)
│   ├── LAN/WAN skyrius (LAN/WAN Department)
│   ├── Videotelekonferencijos skyrius (Video Conference Department)
│   ├── Laidinio rysio skyrius (Wired Communications Department)
│   ├── Kompiuteriniui tinklu skyrius (Computer Networks Department)
│   ├── 1 rysiu skyrius (1st Communications Department)
│   ├── 2 rysiu skyrius (2nd Communications Department)
│   └── Vartotoju aptarnavimo skyrius (User Service Department)
└── Valdymo grupe (Management Group)
```

### C. API Response Examples

#### Complete Soldier Record

```json
{
  "_id": "507f1f77bcf86cd799439013",
  "firstName": "Jonas",
  "lastName": "Jonaitis",
  "militaryRank": "Seržantas",
  "joinDate": "2023-01-15T00:00:00.000Z",
  "primaryUnit": "Rysiu ir informaciniu sistemu burys",
  "subUnit": "RIS burys",
  "active": true,
  "createdAt": "2024-01-15T10:00:00.000Z",
  "updatedAt": "2024-01-15T10:00:00.000Z"
}
```

#### Complete Exercise Record

```json
{
  "_id": "507f1f77bcf86cd799439017",
  "taskId": {
    "_id": "507f1f77bcf86cd799439020",
    "name": "Fizinio pasirengimo patikrinimas",
    "type": "Individualios"
  },
  "date": "2024-01-20T00:00:00.000Z",
  "duration": 2.5,
  "stage": "IS",
  "instructor": {
    "_id": "507f1f77bcf86cd799439013",
    "firstName": "Jonas",
    "lastName": "Jonaitis",
    "militaryRank": "Seržantas"
  },
  "participants": [
    {
      "soldier": {
        "_id": "507f1f77bcf86cd799439014",
        "firstName": "Petras",
        "lastName": "Petraitis",
        "militaryRank": "Eilinis"
      },
      "attended": true
    },
    {
      "soldier": {
        "_id": "507f1f77bcf86cd799439015",
        "firstName": "Antanas",
        "lastName": "Antanaitis",
        "militaryRank": "Vyresnysis Eilinis"
      },
      "attended": false
    }
  ],
  "unit": "Paramos burys",
  "createdBy": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "admin"
  },
  "createdAt": "2024-01-20T08:00:00.000Z"
}
```

#### Complete Evaluation Record

```json
{
  "_id": "507f1f77bcf86cd799439019",
  "date": "2024-01-22T00:00:00.000Z",
  "evaluationType": "Oficialus",
  "taskCode": "TSK-001",
  "taskName": "Fizinio pasirengimo testas",
  "recordedBy": {
    "_id": "507f1f77bcf86cd799439013",
    "firstName": "Jonas",
    "lastName": "Jonaitis",
    "militaryRank": "Seržantas"
  },
  "ratings": [
    {
      "soldier": {
        "_id": "507f1f77bcf86cd799439014",
        "firstName": "Petras",
        "lastName": "Petraitis",
        "militaryRank": "Eilinis"
      },
      "rating": "I"
    },
    {
      "soldier": {
        "_id": "507f1f77bcf86cd799439015",
        "firstName": "Antanas",
        "lastName": "Antanaitis",
        "militaryRank": "Vyresnysis Eilinis"
      },
      "rating": "IA"
    },
    {
      "soldier": {
        "_id": "507f1f77bcf86cd799439016",
        "firstName": "Kazys",
        "lastName": "Kazaitis",
        "militaryRank": "Grandinis"
      },
      "rating": "NI"
    }
  ],
  "unit": "Paramos burys",
  "completionPercentage": 66.7,
  "totalPassed": 2,
  "dailyPassed": 2,
  "createdBy": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "admin"
  },
  "createdAt": "2024-01-22T14:30:00.000Z"
}
```

### D. Database Schema Relationships

```
Users (1) ──────────────┐
                       │
                       │ createdBy
                       │
                       ▼
Soldiers (Many) ────────────────┐
     │                         │
     │ solderId                │
     │                         │
     ▼                         ▼
Attendance (Many)         Exercises (Many)
     │                         │
     │ createdBy               │ participants.soldier
     │                         │ instructor
     ▼                         │
Users (1)                      │
                               │
                               ▼
                          Tasks (1) ────── taskId
                               │
                               │ createdBy
                               ▼
                          Users (1)

Evaluations (Many) ─────┐
     │                  │
     │ ratings.soldier  │ recordedBy
     │                  │
     ▼                  ▼
Soldiers (Many)    Soldiers (1)
     │
     │ createdBy
     ▼
Users (1)

StructuralUnits (Many)
     │
     │ (no direct relationships, used for validation)
     │
     └── Referenced in Soldier.subUnit field
```

### E. Environment Variables Reference

| Variable                  | Type   | Required | Default     | Description                       |
| ------------------------- | ------ | -------- | ----------- | --------------------------------- |
| `PORT`                    | Number | No       | 5000        | Server port number                |
| `NODE_ENV`                | String | No       | development | Environment mode                  |
| `MONGO_URI`               | String | Yes      | -           | MongoDB connection string         |
| `JWT_SECRET`              | String | Yes      | -           | JWT signing secret (min 32 chars) |
| `JWT_EXPIRE`              | String | No       | 24h         | JWT token expiration time         |
| `FRONTEND_URL`            | String | No       | -           | Frontend URL for CORS             |
| `LOG_LEVEL`               | String | No       | info        | Logging level                     |
| `RATE_LIMIT_WINDOW_MS`    | Number | No       | 900000      | Rate limit window (15 min)        |
| `RATE_LIMIT_MAX_REQUESTS` | Number | No       | 100         | Max requests per window           |

### F. Status Codes Quick Reference

| Code | Name                  | Description             | Usage                      |
| ---- | --------------------- | ----------------------- | -------------------------- |
| 200  | OK                    | Success                 | GET, PUT requests          |
| 201  | Created               | Resource created        | POST requests              |
| 204  | No Content            | Success, no content     | DELETE requests            |
| 400  | Bad Request           | Client error            | Validation errors          |
| 401  | Unauthorized          | Authentication required | Missing/invalid token      |
| 403  | Forbidden             | Access denied           | Insufficient permissions   |
| 404  | Not Found             | Resource not found      | Invalid resource ID        |
| 409  | Conflict              | Resource conflict       | Duplicate creation         |
| 422  | Unprocessable Entity  | Validation error        | Business logic violations  |
| 429  | Too Many Requests     | Rate limited            | Exceeded rate limits       |
| 500  | Internal Server Error | Server error            | Unexpected errors          |
| 503  | Service Unavailable   | Service down            | Database connection issues |

### G. Useful Commands Quick Reference

#### Development Commands

```bash
# Start development server
npm run dev

# Run tests
npm test

# Run linting
npm run lint

# Seed database
npm run seed

# Check dependencies
npm audit

# Update dependencies
npm update
```

#### Database Commands

```bash
# Connect to MongoDB
mongosh "mongodb://localhost:27017/prism"

# Show databases
show dbs

# Use database
use prism

# Show collections
show collections

# Count documents
db.soldiers.countDocuments()

# Find documents
db.soldiers.find().pretty()

# Drop collection
db.collection.drop()
```

#### Production Commands

```bash
# Start with PM2
pm2 start ecosystem.config.js --env production

# Monitor PM2
pm2 monit

# View logs
pm2 logs prism-api

# Restart application
pm2 restart prism-api

# Check status
pm2 status

# Save PM2 config
pm2 save
```

---

## Support & Contact

### Documentation

- **API Documentation**: Available at `/api-docs` when server is running
- **Code Repository**: [GitHub Repository URL]
- **Wiki**: [Internal Wiki URL if available]

### Getting Help

1. **Check this documentation** for common issues and solutions
2. **Search existing issues** in the project repository
3. **Check logs** for error details and stack traces
4. **Create detailed bug reports** with reproduction steps

### Bug Reports

When reporting bugs, please include:

- **Environment details** (Node.js version, OS, etc.)
- **Error messages** and stack traces
- **Steps to reproduce** the issue
- **Expected vs actual behavior**
- **Relevant logs** and configuration

### Feature Requests

For new features:

- **Describe the use case**
- **Provide detailed requirements**
- **Consider impact** on existing functionality
- **Suggest implementation approach** if applicable

### Contributing

1. **Fork the repository**
2. **Create feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make changes** following code style guidelines
4. **Write tests** for new functionality
5. **Update documentation** as needed
6. **Submit pull request** with detailed description

---

**© 2024 PRISM Project. All rights reserved.**

_This documentation is maintained by the PRISM development team. Last updated: January 2024_
