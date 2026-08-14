# Job Application Tracker

A full-stack Job Application Tracker built using Node.js, Express,
MySQL, Sequelize, JWT, React, AWS S3 and SendGrid.

## Features

- User registration and login
- JWT authentication
- Profile management
- Company management
- Job listing management
- Job application tracking
- Application status tracking
- Search and filtering
- Pagination and sorting
- Application notes
- Resume and cover letter uploads
- AWS S3 file storage
- Follow-up reminders
- Email reminder notifications
- Dashboard statistics
- Application progress visualization

---

# Tech Stack

## Backend

- Node.js
- Express.js
- Sequelize
- MySQL
- JWT
- Multer
- AWS S3
- SendGrid

## Frontend

- React
- React Router
- Axios
- CSS

---

# Authentication

Protected APIs require:

Authorization:

Bearer `<JWT_TOKEN>`

---

# API Documentation

## Authentication

### Register

POST `/api/v1/auth/register`

Request:

```json
{
  "name": "Neha",
  "email": "neha@example.com",
  "password": "Password@123"
}
```

Response:

{
"success": true,
"message": "User registered successfully"
}
Login

POST /api/v1/auth/login

Request:

{
"email": "neha@example.com",
"password": "Password@123"
}

Response:

{
"success": true,
"data": {
"token": "JWT_TOKEN"
}
}
Profile
Get Profile

GET /api/v1/profile/me

Authentication: Required

Update Profile

PUT /api/v1/profile/me

Authentication: Required

Request:

{
"phone": "9999999999",
"location": "Delhi",
"careerGoal": "Backend Developer",
"experienceLevel": "Fresher"
}
Companies
Create Company

POST /api/v1/companies

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
Get Companies

GET /api/v1/companies

Get Company

GET /api/v1/companies/:id

Update Company

PUT /api/v1/companies/:id

Delete Company

DELETE /api/v1/companies/:id

Job Listings
Create Job Listing

POST /api/v1/job-listings

{
"companyId": 1,
"title": "Backend Developer",
"jobUrl": "https://linkedin.com/jobs/123",
"location": "Bangalore",
"description": "Node.js backend role",
"source": "LinkedIn"
}
Get Job Listings

GET /api/v1/job-listings

Get Job Listing

GET /api/v1/job-listings/:id

Update Job Listing

PUT /api/v1/job-listings/:id

Delete Job Listing

DELETE /api/v1/job-listings/:id

Applications
Create Application

POST /api/v1/applications

{
"companyId": 1,
"jobListingId": 2,
"jobTitle": "Backend Developer",
"status": "APPLIED",
"appliedAt": "2026-08-14",
"source": "LinkedIn",
"jobUrl": "https://linkedin.com/jobs/123"
}
Get Applications

GET /api/v1/applications

Supported query parameters:

search
status
companyId
from
to
page
limit
sortBy
order

Example:

GET /api/v1/applications?status=INTERVIEW&page=1&limit=10
Get Application

GET /api/v1/applications/:id

Update Application

PUT /api/v1/applications/:id

{
"status": "INTERVIEW"
}
Delete Application

DELETE /api/v1/applications/:id

Notes
Create Note

POST /api/v1/applications/:applicationId/notes

{
"content": "Recruiter called. Technical interview scheduled."
}
Get Notes

GET /api/v1/applications/:applicationId/notes

Update Note

PUT /api/v1/notes/:id

Delete Note

DELETE /api/v1/notes/:id

Attachments
Upload Attachment

POST /api/v1/applications/:applicationId/attachments

Content-Type:

multipart/form-data

Fields:

file
documentType

Supported files:

PDF
DOC
DOCX
JPG
PNG

Maximum size:

5 MB

Files are stored in AWS S3.

Get Attachments

GET /api/v1/applications/:applicationId/attachments

Download Attachment

GET /api/v1/attachments/:id/download

Delete Attachment

DELETE /api/v1/attachments/:id

Reminders
Create Reminder

POST /api/v1/applications/:applicationId/reminders

{
"title": "Follow up with recruiter",
"message": "Send follow-up email",
"reminderAt": "2026-08-15T10:00:00"
}
Get Application Reminders

GET /api/v1/applications/:applicationId/reminders

Get All Reminders

GET /api/v1/reminders

Update Reminder

PUT /api/v1/reminders/:id

{
"isCompleted": true
}
Delete Reminder

DELETE /api/v1/reminders/:id

Dashboard
Dashboard Statistics

GET /api/v1/dashboard

Returns:

Total applications
Applications by status
Response rate
Application timeline/statistics
Email Notifications

The application uses SendGrid for reminder notifications.

When a reminder becomes due:

Reminder
↓
Scheduler
↓
SendGrid
↓
User email
↓
emailSent = true
File Storage

Application documents are stored in AWS S3.

The database stores:

Original filename
Generated filename
MIME type
File size
S3 object key

The S3 bucket is private.

Security

The application uses JWT authentication.

User-owned resources are always queried using:

{
id: resourceId,
userId: req.user.id
}

This prevents users from accessing or modifying another user's:

Applications
Companies
Job listings
Notes
Attachments
Reminders
Local Setup
Clone
git clone <YOUR_GITHUB_REPOSITORY>
cd jobApplicationTracker
Backend
cd backend
npm install
npm run dev
Frontend
cd frontend
npm install
npm run dev
