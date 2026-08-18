# Job Application Tracker

A full-stack Job Application Tracker that helps users manage their complete
job-search workflow from one place.

Users can create and manage companies, save interesting job listings, track
applications, update application statuses, add recruiter/interview notes,
upload resumes and other documents, create follow-up reminders, receive email
notifications, and monitor their job-search progress through a dashboard.

---

## 🚀 Features

### 🔐 Authentication & Authorization

- User registration
- User login
- JWT-based authentication
- Protected API routes
- User-specific data access
- Password hashing
- Duplicate user prevention

### 👤 Profile Management

- View profile
- Update profile information
- Store career-related information

### 🏢 Company Management

- Create companies
- View all companies
- View company details
- Update company information
- Delete companies
- Store recruiter/contact information

### 💼 Saved Job Listings

- Save interesting job opportunities
- Store job title, company and location
- Store job URL
- Store job source
- Update saved job information
- Delete saved jobs

### 📋 Job Application Tracking

- Create job applications
- Track application status
- Associate applications with companies
- Associate applications with saved job listings
- Store application date
- Store job source
- Store job URL
- Search applications
- Filter applications by status/company
- Filter by date range
- Pagination
- Sorting
- Update application status
- Delete applications

### 📝 Application Notes

Users can maintain notes for individual applications.

Examples:

- Recruiter calls
- Interview updates
- Follow-up information
- Technical interview notes
- HR discussions
- Offer details

### 📎 Attachments

Users can upload documents related to applications.

Supported documents include:

- Resume
- Cover letter
- Other application-related files

Files are stored using AWS S3.

### ⏰ Follow-up Reminders

Users can create reminders for individual applications.

Each reminder can contain:

- Reminder title
- Reminder message
- Reminder date and time
- Completion status
- Email notification status

### 📧 Email Notifications

The application uses SendGrid for automated reminder emails.

A background scheduler checks pending reminders every minute.

When a reminder becomes due:

```text
Reminder Created
      ↓
Stored in MySQL
      ↓
Scheduler checks every minute
      ↓
Reminder becomes due
      ↓
SendGrid sends email
      ↓
emailSent = true
```

### 📊 Dashboard

The dashboard provides an overview of the user's job search.

It includes:

- Total applications
- Applied applications
- Interviews
- Offers
- Rejected applications
- Response rate
- Application progress

---

# 🛠️ Tech Stack

## Frontend

- React
- React Router
- Axios
- Vite
- CSS

## Backend

- Node.js
- Express.js
- Sequelize ORM
- MySQL
- JWT
- bcryptjs
- Express Validator
- Multer
- Node Cron

## Cloud Services

- AWS S3 - document/file storage
- SendGrid - email notifications

---

# 🏗️ Project Structure

```text
jobApplicationTracker/
│
├── backend/
│   │
│   ├── src/
│   │   ├── config/
│   │   │
│   │   ├── controllers/
│   │   │
│   │   ├── middleware/
│   │   │
│   │   ├── models/
│   │   │
│   │   ├── routers/
│   │   │
│   │   ├── services/
│   │   │
│   │   └── validators/
│   │
│   ├── uploads/
│   │
│   ├── package.json
│   ├── server.js
│   └── readme.md
│
└── frontend/
    │
    ├── public/
    │
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   └── services/
    │
    ├── package.json
    ├── vite.config.js
    └── README.md
```

---

# 🔄 Application Architecture

The backend follows a layered architecture.

```text
React Frontend
      ↓
Axios API Requests
      ↓
Express Routes
      ↓
Authentication / Validation Middleware
      ↓
Controllers
      ↓
Services
      ↓
Sequelize Models
      ↓
MySQL Database
```

For file uploads:

```text
React
  ↓
Express
  ↓
Multer
  ↓
S3 Service
  ↓
AWS S3
```

For reminders:

```text
React
  ↓
Reminder API
  ↓
MySQL
  ↓
Node-Cron Scheduler
  ↓
SendGrid
  ↓
User Email
```

---

# 📌 API Information

## Base URL

For local development:

```text
http://localhost:3000/api/v1
```

Example:

```http
GET http://localhost:3000/api/v1/applications
```

---

# 🔐 Authentication

Protected APIs require a JWT token.

The token must be sent using the `Authorization` header.

```http
Authorization: Bearer <JWT_TOKEN>
```

Example:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

---

# 🔑 Authentication APIs

## Register

```http
POST /api/v1/auth/register
```

### Request

```json
{
  "name": "Neha",
  "email": "neha@example.com",
  "password": "Password@123"
}
```

### Response

```json
{
  "success": true,
  "message": "User registered successfully"
}
```

---

## Login

```http
POST /api/v1/auth/login
```

### Request

```json
{
  "email": "neha@example.com",
  "password": "Password@123"
}
```

### Response

```json
{
  "success": true,
  "data": {
    "token": "JWT_TOKEN"
  }
}
```

---

# 👤 Profile APIs

## Get Profile

```http
GET /api/v1/profile/me
```

Authentication required.

---

## Update Profile

```http
PUT /api/v1/profile/me
```

Authentication required.

Example:

```json
{
  "phone": "9999999999",
  "location": "Delhi",
  "careerGoal": "Backend Developer",
  "experienceLevel": "Fresher"
}
```

---

# 🏢 Company APIs

## Create Company

```http
POST /api/v1/companies
```

Example:

```json
{
  "name": "Google",
  "industry": "Technology",
  "location": "Bangalore",
  "companySize": "10000+",
  "website": "https://google.com",
  "contactName": "HR Team",
  "contactEmail": "hr@example.com",
  "notes": "Target company"
}
```

---

## Get Companies

```http
GET /api/v1/companies
```

---

## Get Company

```http
GET /api/v1/companies/:id
```

Example:

```http
GET /api/v1/companies/1
```

---

## Update Company

```http
PUT /api/v1/companies/:id
```

---

## Delete Company

```http
DELETE /api/v1/companies/:id
```

---

# 💼 Job Listing APIs

The API uses the `/job-listings` route for saved job listings.

## Create Job Listing

```http
POST /api/v1/job-listings
```

Example:

```json
{
  "companyId": 1,
  "title": "Backend Developer",
  "jobUrl": "https://linkedin.com/jobs/123",
  "location": "Bangalore",
  "description": "Node.js backend role",
  "source": "LinkedIn"
}
```

---

## Get Job Listings

```http
GET /api/v1/job-listings
```

---

## Get Job Listing

```http
GET /api/v1/job-listings/:id
```

---

## Update Job Listing

```http
PUT /api/v1/job-listings/:id
```

---

## Delete Job Listing

```http
DELETE /api/v1/job-listings/:id
```

---

# 📋 Application APIs

## Create Application

```http
POST /api/v1/applications
```

Example:

```json
{
  "companyId": 1,
  "jobListingId": 2,
  "jobTitle": "Backend Developer",
  "status": "APPLIED",
  "appliedAt": "2026-08-18",
  "source": "LinkedIn",
  "jobUrl": "https://linkedin.com/jobs/123"
}
```

---

## Get Applications

```http
GET /api/v1/applications
```

### Supported Query Parameters

```text
search
status
companyId
from
to
page
limit
sortBy
order
```

Example:

```http
GET /api/v1/applications?status=INTERVIEW&page=1&limit=10
```

Example search:

```http
GET /api/v1/applications?search=Backend
```

Example combined request:

```http
GET /api/v1/applications?search=Backend&status=INTERVIEW&page=1&limit=10
```

---

## Get Application

```http
GET /api/v1/applications/:id
```

Example:

```http
GET /api/v1/applications/8
```

---

## Update Application

```http
PUT /api/v1/applications/:id
```

Example:

```json
{
  "status": "INTERVIEW"
}
```

---

## Delete Application

```http
DELETE /api/v1/applications/:id
```

---

# 📊 Application Statuses

Applications can move through different stages of the hiring process.

Common statuses include:

```text
SAVED
APPLIED
SCREENING
INTERVIEW
OFFERED
REJECTED
WITHDRAWN
ACCEPTED
```

Example workflow:

```text
SAVED
  ↓
APPLIED
  ↓
SCREENING
  ↓
INTERVIEW
  ↓
OFFERED
  ↓
ACCEPTED
```

A rejected application can move to:

```text
REJECTED
```

---

# 📝 Notes APIs

Notes belong to individual applications.

## Create Note

```http
POST /api/v1/applications/:applicationId/notes
```

Example:

```json
{
  "content": "Recruiter called. Technical interview scheduled."
}
```

---

## Get Notes

```http
GET /api/v1/applications/:applicationId/notes
```

---

## Update Note

```http
PUT /api/v1/notes/:id
```

Example:

```json
{
  "content": "Technical interview scheduled for Monday at 11 AM."
}
```

---

## Delete Note

```http
DELETE /api/v1/notes/:id
```

---

# 📎 Attachment APIs

Attachments are associated with job applications.

## Upload Attachment

```http
POST /api/v1/applications/:applicationId/attachments
```

Authentication required.

Content type:

```http
multipart/form-data
```

Form-data fields:

```text
file
documentType
```

Supported file types:

```text
PDF
DOC
DOCX
JPG
PNG
```

Maximum file size:

```text
5 MB
```

Files are stored in AWS S3.

---

## Get Application Attachments

```http
GET /api/v1/applications/:applicationId/attachments
```

---

## Download Attachment

```http
GET /api/v1/attachments/:id/download
```

---

## Delete Attachment

```http
DELETE /api/v1/attachments/:id
```

---

# ⏰ Reminder APIs

Reminders are associated with individual applications.

## Create Reminder

```http
POST /api/v1/applications/:applicationId/reminders
```

Example:

```json
{
  "title": "Follow up with recruiter",
  "message": "Send follow-up email",
  "reminderAt": "2026-08-18T18:30:00"
}
```

---

## Get Application Reminders

```http
GET /api/v1/applications/:applicationId/reminders
```

---

## Get All User Reminders

```http
GET /api/v1/reminders
```

This returns reminders belonging to the authenticated user.

Example response:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "userId": 4,
      "applicationId": 8,
      "title": "Follow up with recruiter",
      "message": "Send follow-up email",
      "reminderAt": "2026-08-18T18:30:00.000Z",
      "isCompleted": false,
      "emailSent": false
    }
  ]
}
```

---

## Update Reminder

```http
PUT /api/v1/reminders/:id
```

Example:

```json
{
  "isCompleted": true
}
```

---

## Delete Reminder

```http
DELETE /api/v1/reminders/:id
```

---

# 📧 Email Reminder System

The application uses SendGrid for reminder emails.

The backend uses `node-cron` to periodically check pending reminders.

The scheduler runs every minute:

```text
* * * * *
```

The reminder processing flow is:

```text
User creates reminder
        ↓
Reminder saved in MySQL
        ↓
node-cron runs every minute
        ↓
Find due reminders
        ↓
Check:
  reminderAt <= current time
  isCompleted = false
  emailSent = false
        ↓
Send email through SendGrid
        ↓
Update emailSent
        ↓
Reminder is no longer processed
```

---

## Reminder Fields

Each reminder contains:

| Field | Description |
|---|---|
| id | Reminder ID |
| userId | Owner of reminder |
| applicationId | Related application |
| title | Reminder title |
| message | Reminder details |
| reminderAt | Date/time when reminder becomes due |
| isCompleted | Whether reminder is completed |
| emailSent | Whether notification email has been sent |

---

# 📈 Dashboard API

## Get Dashboard Statistics

```http
GET /api/v1/dashboard
```

Authentication required.

The dashboard provides job-search statistics such as:

- Total applications
- Applications by status
- Interviews
- Offers
- Rejections
- Response rate
- Application timeline/statistics

---

# 🔎 Search & Filtering

Applications can be searched and filtered through query parameters.

## Search

```http
GET /api/v1/applications?search=Google
```

---

## Filter by Status

```http
GET /api/v1/applications?status=INTERVIEW
```

---

## Filter by Company

```http
GET /api/v1/applications?companyId=1
```

---

## Date Range

```http
GET /api/v1/applications?from=2026-08-01&to=2026-08-18
```

---

## Pagination

```http
GET /api/v1/applications?page=1&limit=10
```

---

## Sorting

```http
GET /api/v1/applications?sortBy=appliedAt&order=DESC
```

---

# ❌ Error Handling

API errors use a consistent JSON response structure.

Example:

```json
{
  "success": false,
  "message": "Application not found"
}
```

---

## Common HTTP Status Codes

| Status | Meaning |
|---|---|
| 200 | Successful request |
| 201 | Resource created |
| 400 | Bad request / validation error |
| 401 | Authentication required |
| 403 | Forbidden |
| 404 | Resource not found |
| 409 | Conflict / duplicate resource |
| 500 | Internal server error |

---

# 🔒 Security

## JWT Authentication

Protected APIs require:

```http
Authorization: Bearer <JWT_TOKEN>
```

---

## Password Hashing

Passwords are never stored as plain text.

Passwords are hashed before being stored in MySQL.

---

## User Data Isolation

Every user-owned resource is associated with the authenticated user.

Examples:

- Applications
- Companies
- Job listings
- Notes
- Attachments
- Reminders
- Profile data

The backend verifies ownership using the authenticated user's ID.

This prevents one user from accessing another user's resources.

---

## Environment Variables

Sensitive credentials must never be committed to Git.

Create a `.env` file inside the backend directory.

Example:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_NAME=job_application_tracker
DB_USER=root
DB_PASSWORD=your_mysql_password

JWT_SECRET=your_jwt_secret

AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_S3_BUCKET=your_bucket_name

SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=your_verified_sender_email
```

Never commit the real `.env` file.

Add it to `.gitignore`:

```text
.env
```

---

# 🗄️ Database

The project uses:

```text
MySQL
```

with:

```text
Sequelize ORM
```

The backend establishes the database connection before starting the server.

Sequelize is also used to synchronize the database models.

---

# ☁️ AWS S3 Storage

Application documents are stored in AWS S3.

Typical files include:

```text
Resume
Cover Letter
Certificates
Other application documents
```

The database stores metadata such as:

```text
Original filename
Generated filename
MIME type
File size
S3 object key
```

The S3 bucket should remain private.

---

# 📦 Installation

## Prerequisites

Install the following:

- Node.js
- npm
- MySQL
- AWS account for S3 storage
- SendGrid account for email notifications

---

# 1. Clone Repository

```bash
git clone https://github.com/Neha-singh16/SharpenerDev.git
```

Navigate to the project:

```bash
cd SharpenerDev/jobApplicationTracker
```

---

# 2. Backend Setup

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create:

```text
backend/.env
```

Configure the required environment variables.

---

# 3. Database Setup

Create a MySQL database.

Example:

```sql
CREATE DATABASE job_application_tracker;
```

Update the database credentials inside `.env`.

Example:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=job_application_tracker
DB_USER=root
DB_PASSWORD=your_password
```

---

# 4. Start Backend

Run:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:3000
```

The API base URL is:

```text
http://localhost:3000/api/v1
```

---

# 5. Frontend Setup

Open another terminal.

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

Vite will provide the frontend development URL.

Typically:

```text
http://localhost:5173
```

---

# ▶️ Running the Full Application

You need two development servers.

## Terminal 1 — Backend

```bash
cd jobApplicationTracker/backend
npm install
npm run dev
```

## Terminal 2 — Frontend

```bash
cd jobApplicationTracker/frontend
npm install
npm run dev
```

Then open the frontend URL shown by Vite.

---

# 🧪 API Testing with Postman

Recommended testing flow:

### 1. Register

```http
POST /api/v1/auth/register
```

### 2. Login

```http
POST /api/v1/auth/login
```

Copy the JWT token.

### 3. Add Authorization

For protected endpoints:

```http
Authorization: Bearer <JWT_TOKEN>
```

### 4. Create Company

```http
POST /api/v1/companies
```

### 5. Create Job Listing

```http
POST /api/v1/job-listings
```

### 6. Create Application

```http
POST /api/v1/applications
```

### 7. Add Note

```http
POST /api/v1/applications/:applicationId/notes
```

### 8. Upload Attachment

```http
POST /api/v1/applications/:applicationId/attachments
```

Use:

```text
multipart/form-data
```

### 9. Create Reminder

```http
POST /api/v1/applications/:applicationId/reminders
```

### 10. Check Dashboard

```http
GET /api/v1/dashboard
```

---

# 🔄 Typical User Workflow

```text
Register
   ↓
Login
   ↓
Dashboard
   ↓
Create Company
   ↓
Save Job Listing
   ↓
Create Job Application
   ↓
Upload Resume / Documents
   ↓
Add Recruiter / Interview Notes
   ↓
Create Follow-up Reminder
   ↓
Receive Email Notification
   ↓
Update Application Status
   ↓
Track Progress on Dashboard
```

---

# 📁 Main Backend Modules

## Config

Responsible for configuration such as:

- Database connection
- AWS configuration
- Environment variables

---

## Models

Defines Sequelize database models.

Examples:

```text
User
Profile
Company
JobListing
Application
Note
Attachment
Reminder
```

---

## Controllers

Controllers handle HTTP requests and responses.

Responsibilities:

```text
Receive request
Validate request data
Call service
Return response
Pass errors to middleware
```

---

## Services

Business logic is separated from controllers.

Examples:

```text
Application Service
Company Service
Reminder Service
Email Service
S3 Service
```

---

## Middleware

Middleware handles cross-cutting concerns such as:

- Authentication
- Validation
- Error handling
- Request processing

---

## Routers

Routers define API endpoints.

Examples:

```text
authRouter
profileRouter
companyRouter
jobRouter
applicationRouter
noteRouter
attachmentRouter
reminderRouter
dashboardRouter
```

---

# 🧠 Design Decisions

## Layered Architecture

The application separates:

```text
Routes
Controllers
Services
Models
```

This keeps business logic out of route files and makes the backend easier to
maintain and extend.

---

## JWT Authentication

JWT allows the backend to authenticate API requests without storing server-side
session state.

---

## Sequelize ORM

Sequelize provides:

- Model definitions
- Relationships
- Query building
- Validation
- Database abstraction

---

## Background Reminder Scheduler

Reminders are not dependent on the frontend remaining open.

The backend scheduler checks the database independently.

This means the user can close the browser and still receive a reminder email
when the backend is running.

---

# 📋 API Endpoint Summary

| Module | Method | Endpoint | Authentication |
|---|---|---|---|
| Auth | POST | `/auth/register` | No |
| Auth | POST | `/auth/login` | No |
| Profile | GET | `/profile/me` | Yes |
| Profile | PUT | `/profile/me` | Yes |
| Company | POST | `/companies` | Yes |
| Company | GET | `/companies` | Yes |
| Company | GET | `/companies/:id` | Yes |
| Company | PUT | `/companies/:id` | Yes |
| Company | DELETE | `/companies/:id` | Yes |
| Job Listing | POST | `/job-listings` | Yes |
| Job Listing | GET | `/job-listings` | Yes |
| Job Listing | GET | `/job-listings/:id` | Yes |
| Job Listing | PUT | `/job-listings/:id` | Yes |
| Job Listing | DELETE | `/job-listings/:id` | Yes |
| Application | POST | `/applications` | Yes |
| Application | GET | `/applications` | Yes |
| Application | GET | `/applications/:id` | Yes |
| Application | PUT | `/applications/:id` | Yes |
| Application | DELETE | `/applications/:id` | Yes |
| Note | POST | `/applications/:applicationId/notes` | Yes |
| Note | GET | `/applications/:applicationId/notes` | Yes |
| Note | PUT | `/notes/:id` | Yes |
| Note | DELETE | `/notes/:id` | Yes |
| Attachment | POST | `/applications/:applicationId/attachments` | Yes |
| Attachment | GET | `/applications/:applicationId/attachments` | Yes |
| Attachment | GET | `/attachments/:id/download` | Yes |
| Attachment | DELETE | `/attachments/:id` | Yes |
| Reminder | POST | `/applications/:applicationId/reminders` | Yes |
| Reminder | GET | `/applications/:applicationId/reminders` | Yes |
| Reminder | GET | `/reminders` | Yes |
| Reminder | PUT | `/reminders/:id` | Yes |
| Reminder | DELETE | `/reminders/:id` | Yes |
| Dashboard | GET | `/dashboard` | Yes |

---

# 📚 API Documentation

Detailed API documentation is available in:

```text
backend/API_DOCUMENTATION.md
```

It contains:

- Request examples
- Response examples
- Authentication details
- Endpoint descriptions
- Query parameters
- Reminder APIs
- Attachment APIs
- Error handling
- API testing workflow

---

# 🛠️ Available Backend Commands

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

The development server uses Nodemon.

---

# 🛠️ Available Frontend Commands

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

---

# 🚧 Future Improvements

Potential future improvements include:

- Automated application status detection
- Gmail integration
- Calendar integration
- Interview scheduling
- Advanced analytics
- Application activity timeline
- Resume version management
- Email templates
- Recruiter contact management
- Push notifications
- Production deployment
- Automated testing
- CI/CD pipeline

---

# ⚠️ Important Development Notes

## Keep Backend Running for Email Reminders

The reminder scheduler runs inside the backend process.

Therefore:

```text
Backend running
      ↓
Scheduler running
      ↓
Reminders checked
      ↓
Emails can be sent
```

If the backend server is stopped, the scheduler is also stopped.

---

## Do Not Commit Secrets

Never commit:

```text
.env
AWS credentials
JWT secrets
SendGrid API keys
Database passwords
```

---

# 🐛 Troubleshooting

## Backend does not start

Check:

```text
MySQL is running
.env exists
Database credentials are correct
Node.js is installed
npm install was executed
```

---

## Database connection fails

Verify:

```env
DB_HOST
DB_PORT
DB_NAME
DB_USER
DB_PASSWORD
```

---

## JWT Authentication fails

Check that the request contains:

```http
Authorization: Bearer <JWT_TOKEN>
```

---

## File upload fails

Check:

```text
AWS credentials
AWS region
S3 bucket name
File size
Supported file type
```

---

## Reminder email is not received

Check:

```text
SENDGRID_API_KEY
SENDGRID_FROM_EMAIL
SendGrid sender verification
Backend is running
Reminder reminderAt has passed
isCompleted = false
emailSent = false
```

Check the backend terminal for scheduler logs.

Expected logs include:

```text
Reminder scheduler started
Checking reminders...
```

---

# 👩‍💻 Author

**Neha Singh**

Full-Stack Developer

GitHub:

https://github.com/Neha-singh16

---

# 📄 License

This project is currently intended as a learning and portfolio project.
