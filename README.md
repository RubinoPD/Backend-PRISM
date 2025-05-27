# PRISM Backend API

Personnel Records and Information System Management - Backend API

## Overview

PRISM is a comprehensive personnel management system designed for military units to track attendance, training exercises, evaluations, and personnel information. This backend API provides secure endpoints for managing soldiers, exercises, evaluations, and attendance records.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Personnel Management**: Manage soldiers, ranks, and unit assignments
- **Attendance Tracking**: Daily attendance records with various status types
- **Exercise Management**: Track training exercises with participants and instructors
- **Evaluation System**: Record and track personnel evaluations and ratings
- **Statistical Reports**: Generate comprehensive statistics and analytics
- **Structural Units**: Manage organizational units and hierarchies

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet.js, CORS, bcryptjs
- **Logging**: Morgan + Custom Logger
- **Validation**: Mongoose validation + Custom validators

## Prerequisites

- Node.js (version 16.0 or higher)
- MongoDB (version 4.4 or higher)
- npm or yarn package manager

## Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd prism-backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Environment Configuration:**

   ```bash
   cp .env.example .env
   ```

   Edit the `.env` file with your configuration:

   ```
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb://localhost:27017/prism
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
   ```

4. **Start MongoDB:**
   Ensure MongoDB is running on your system.

5. **Seed the database (optional):**

   ```bash
   npm run seed
   ```

   This creates default users and initial data.

6. **Start the development server:**
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication Routes (`/api/auth`)

- `POST /login` - User login
- `GET /me` - Get current user profile
- `POST /register` - Register new user (Admin only)
- `GET /users` - Get all users (Admin only)
- `DELETE /users/:id` - Delete user (Admin only)

### Soldiers Routes (`/api/soldiers`)

- `GET /` - Get all soldiers
- `GET /:id` - Get soldier by ID
- `POST /` - Create new soldier (Admin/Superuser)
- `PUT /:id` - Update soldier (Admin/Superuser)
- `DELETE /:id` - Delete soldier (Admin only)

### Attendance Routes (`/api/attendance`)

- `GET /` - Get all attendance records
- `GET /date/:date` - Get attendance for specific date
- `GET /stats` - Get attendance statistics
- `POST /` - Create attendance record (Admin/Superuser)
- `POST /bulk` - Create multiple attendance records (Admin/Superuser)
- `PUT /:id` - Update attendance record (Admin/Superuser)
- `DELETE /:id` - Delete attendance record (Admin only)

### Exercises Routes (`/api/exercises`)

- `GET /` - Get all exercises
- `GET /:id` - Get exercise by ID
- `GET /stats` - Get exercise statistics
- `POST /` - Create new exercise (Admin/Superuser)
- `PUT /:id` - Update exercise (Admin/Superuser)
- `DELETE /:id` - Delete exercise (Admin only)

### Evaluations Routes (`/api/evaluations`)

- `GET /` - Get all evaluations
- `GET /:id` - Get evaluation by ID
- `GET /stats` - Get evaluation statistics
- `POST /` - Create new evaluation (Admin/Superuser)
- `PUT /:id` - Update evaluation (Admin/Superuser)
- `DELETE /:id` - Delete evaluation (Admin only)

### Tasks Routes (`/api/tasks`)

- `GET /` - Get all tasks
- `GET /:id` - Get task by ID
- `POST /` - Create new task (Admin/Superuser)
- `PUT /:id` - Update task (Admin/Superuser)
- `DELETE /:id` - Delete task (Admin only)

### Structural Units Routes (`/api/structural-units`)

- `GET /` - Get all structural units
- `GET /:id` - Get structural unit by ID
- `POST /` - Create new structural unit (Admin/Superuser)
- `POST /initialize` - Initialize default units (Admin only)
- `PUT /:id` - Update structural unit (Admin/Superuser)
- `DELETE /:id` - Delete structural unit (Admin only)

## User Roles

- **Admin**: Full access to all resources, can manage users
- **Superuser**: Can create, read, and update most resources (cannot delete or manage users)

## Default Users (After Seeding)

- **Admin**:
  - Username: `admin`
  - Password: `admin123`
- **Superuser**:
  - Username: `superuser`
  - Password: `super123`

**Important**: Change these default passwords in production!

## Data Models

### Soldier

- Personal information (name, rank, join date)
- Unit assignments (primary unit, sub-unit)
- Status (active/inactive)

### Attendance

- Daily attendance records
- Status types: Present, Absent, Sick, Leave, Mission, Other
- Reason for absence

### Exercise

- Training exercise information
- Participants and attendance
- Instructor assignments
- Exercise stages: IS, IT, II, or "-"

### Evaluation

- Official/Unofficial evaluations
- Task-based assessments
- Ratings: I (Įvykdyta), IA (Įvykdyta Atsižvelgiant), NI (Neįvykdyta), "-" (Nevertinama)

### Task

- Training tasks and descriptions
- Types: Individual or Collective

## Query Parameters

Most GET endpoints support filtering:

- **Date filtering**: `startDate`, `endDate`, `date`
- **Unit filtering**: `unit`, `primaryUnit`, `subUnit`
- **Status filtering**: `status`, `evaluationType`
- **Pagination**: `page`, `limit` (where supported)

### Example Queries

```bash
# Get attendance for specific date
GET /api/attendance/date/2024-01-15

# Get exercises for specific unit
GET /api/exercises?unit=Rysiu ir informaciniu sistemu burys

# Get evaluations in date range
GET /api/evaluations?startDate=2024-01-01&endDate=2024-01-31

# Get attendance statistics with filters
GET /api/attendance/stats?unit=Paramos burys&startDate=2024-01-01&endDate=2024-01-31
```

## Error Handling

The API uses standard HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

Error responses include descriptive messages:
