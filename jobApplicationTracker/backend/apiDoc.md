# Job Application Tracker API Documentation

Complete REST API documentation for the Job Application Tracker backend.

The backend is built with Node.js, Express.js, Sequelize and MySQL. JWT is
used for authentication and authorization.

---

## Table of Contents

1. [API Information](#1-api-information)
2. [Authentication](#2-authentication)
3. [Authentication APIs](#3-authentication-apis)
4. [Profile APIs](#4-profile-apis)
5. [Company APIs](#5-company-apis)
6. [Saved Job Listing APIs](#6-saved-job-listing-apis)
7. [Job Application APIs](#7-job-application-apis)
8. [Application Notes APIs](#8-application-notes-apis)
9. [Attachment APIs](#9-attachment-apis)
10. [Reminder APIs](#10-reminder-apis)
11. [Dashboard API](#11-dashboard-api)
12. [Search and Filtering](#12-search-and-filtering)
13. [Error Handling](#13-error-handling)
14. [HTTP Status Codes](#14-http-status-codes)
15. [API Testing](#15-api-testing)
16. [Email Reminder System](#16-email-reminder-system)
17. [Security](#17-security)

---

# 1. API Information

## Base URL

For local development:

```text
http://localhost:3000/api/v1
```

All API routes are prefixed with:

```text
/api/v1
```

### Example

```http
GET http://localhost:3000/api/v1/applications
```

---

## Content Type

For normal JSON requests:

```http
Content-Type: application/json
```

For file uploads:

```http
Content-Type: multipart/form-data
```

---

## API Architecture

The backend follows a layered architecture:

```text
Client
  |
  v
Routes
  |
  v
Authentication / Validation Middleware
  |
  v
Controllers
  |
  v
Services
  |
  v
Sequelize Models
  |
  v
MySQL Database
```

---

# 2. Authentication

The application uses JSON Web Tokens (JWT).

After successful registration or login, the API returns a JWT token.

Protected endpoints require the token in the request header.

## Authorization Header

```http
Authorization: Bearer <JWT_TOKEN>
```

### Example

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

If the token is missing, invalid or expired, the API returns an authentication
error.

---

# 3. Authentication APIs

Authentication endpoints do not require an existing JWT token.

---

## 3.1 Register User

Creates a new user account.

### Endpoint

```http
POST /auth/register
```

### Authentication

Not required.

### Request Body

```json
{
  "name": "Neha",
  "email": "neha@example.com",
  "password": "Password@123"
}
```

### Fields

| Field | Type | Required | Description |
|---|---|---|---|
| name | String | Yes | User's name |
| email | String | Yes | Valid email address |
| password | String | Yes | User password |

### Success Response

**HTTP 201**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "Neha",
      "email": "neha@example.com"
    },
    "token": "<JWT_TOKEN>"
  }
}
```

### Possible Errors

```text
400 - Validation error
409 - User already exists
500 - Internal server error
```

---

## 3.2 Login User

Authenticates an existing user.

### Endpoint

```http
POST /auth/login
```

### Authentication

Not required.

### Request Body

```json
{
  "email": "neha@example.com",
  "password": "Password@123"
}
```

### Success Response

**HTTP 200**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "Neha",
      "email": "neha@example.com"
    },
    "token": "<JWT_TOKEN>"
  }
}
```

### Invalid Credentials

**HTTP 401**

```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

# 4. Profile APIs

Profile endpoints require authentication.

Base path:

```text
/profile
```

---

## 4.1 Get Current User Profile

Returns the authenticated user's profile.

### Endpoint

```http
GET /profile/me
```

### Authentication

Required.

### Headers

```http
Authorization: Bearer <JWT_TOKEN>
```

### Success Response

**HTTP 200**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Neha",
    "email": "neha@example.com"
  }
}
```

The profile response may also contain profile-specific fields configured by
the application.

---

## 4.2 Update Current User Profile

Updates the authenticated user's profile information.

### Endpoint

```http
PUT /profile/me
```

### Authentication

Required.

### Request Body

Example:

```json
{
  "phone": "9876543210",
  "location": "Delhi",
  "careerGoal": "Backend Developer",
  "experienceLevel": "Fresher"
}
```

Only fields supported by the profile model/service should be supplied.

### Success Response

**HTTP 200**

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {}
}
```

---

# 5. Company APIs

Companies represent organizations that the user is applying to.

All company endpoints require authentication.

Base path:

```text
/companies
```

---

## 5.1 Create Company

Creates a company for the authenticated user.

### Endpoint

```http
POST /companies
```

### Authentication

Required.

### Request Body

```json
{
  "name": "Google",
  "website": "https://google.com",
  "industry": "Technology",
  "companySize": "10000+",
  "location": "Bangalore",
  "contactName": "HR Team",
  "contactEmail": "hr@example.com",
  "notes": "Target company"
}
```

### Fields

| Field | Type | Required | Description |
|---|---|---|---|
| name | String | Yes | Company name |
| website | String | No | Company website |
| industry | String | No | Industry |
| companySize | String | No | Approximate company size |
| location | String | No | Company location |
| contactName | String | No | Recruiter/contact name |
| contactEmail | String | No | Recruiter/contact email |
| notes | String | No | Additional company notes |

### Success Response

**HTTP 201**

```json
{
  "success": true,
  "message": "Company created successfully",
  "data": {
    "id": 1,
    "name": "Google",
    "website": "https://google.com",
    "industry": "Technology",
    "companySize": "10000+",
    "location": "Bangalore",
    "contactName": "HR Team",
    "contactEmail": "hr@example.com",
    "notes": "Target company"
  }
}
```

---

## 5.2 Get All Companies

Returns companies belonging to the authenticated user.

### Endpoint

```http
GET /companies
```

### Authentication

Required.

### Success Response

**HTTP 200**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Google",
      "industry": "Technology",
      "location": "Bangalore"
    },
    {
      "id": 2,
      "name": "Microsoft",
      "industry": "Technology",
      "location": "Hyderabad"
    }
  ]
}
```

---

## 5.3 Get Company By ID

Returns a specific company.

### Endpoint

```http
GET /companies/:id
```

### Authentication

Required.

### Path Parameter

| Parameter | Type | Description |
|---|---|---|
| id | Integer | Company ID |

### Example

```http
GET /companies/1
```

### Success Response

**HTTP 200**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Google",
    "industry": "Technology",
    "location": "Bangalore"
  }
}
```

---

## 5.4 Update Company

Updates an existing company.

### Endpoint

```http
PUT /companies/:id
```

### Authentication

Required.

### Example

```http
PUT /companies/1
```

### Request Body

```json
{
  "industry": "Software",
  "location": "Bangalore",
  "notes": "Updated company information"
}
```

### Success Response

**HTTP 200**

```json
{
  "success": true,
  "message": "Company updated successfully",
  "data": {}
}
```

---

## 5.5 Delete Company

Deletes a company belonging to the authenticated user.

### Endpoint

```http
DELETE /companies/:id
```

### Authentication

Required.

### Example

```http
DELETE /companies/1
```

### Success Response

```json
{
  "success": true,
  "message": "Company deleted successfully"
}
```

---

# 6. Saved Job Listing APIs

Job listings allow users to save interesting jobs for applying later.

Base path:

```text
/jobs
```

All endpoints require authentication.

---

## 6.1 Create Saved Job

### Endpoint

```http
POST /jobs
```

### Authentication

Required.

### Request Body

```json
{
  "companyId": 1,
  "title": "Backend Developer",
  "description": "Node.js backend development role",
  "location": "Bangalore",
  "employmentType": "FULL_TIME",
  "salaryMin": 600000,
  "salaryMax": 1000000,
  "jobUrl": "https://example.com/jobs/123",
  "source": "LinkedIn",
  "status": "SAVED",
  "notes": "Good opportunity"
}
```

### Fields

| Field | Type | Required | Description |
|---|---|---|---|
| companyId | Integer | Yes | Company ID |
| title | String | Yes | Job title |
| description | String | No | Job description |
| location | String | No | Job location |
| employmentType | String | No | Employment type |
| salaryMin | Number | No | Minimum salary |
| salaryMax | Number | No | Maximum salary |
| jobUrl | String | No | Job posting URL |
| source | String | No | Source such as LinkedIn |
| status | String | No | Saved job status |
| notes | String | No | Additional notes |

### Employment Types

```text
FULL_TIME
PART_TIME
CONTRACT
INTERNSHIP
```

### Success Response

**HTTP 201**

```json
{
  "success": true,
  "message": "Job listing saved successfully",
  "data": {}
}
```

---

## 6.2 Get Saved Jobs

### Endpoint

```http
GET /jobs
```

### Authentication

Required.

### Query Parameters

Supported query parameters depend on the current job service implementation.

Example:

```http
GET /jobs?search=Backend
```

### Success Response

```json
{
  "success": true,
  "data": []
}
```

---

## 6.3 Get Saved Job By ID

### Endpoint

```http
GET /jobs/:id
```

### Authentication

Required.

### Example

```http
GET /jobs/1
```

### Success Response

```json
{
  "success": true,
  "data": {}
}
```

---

## 6.4 Update Saved Job

### Endpoint

```http
PUT /jobs/:id
```

### Authentication

Required.

### Request Body

```json
{
  "status": "APPLIED",
  "notes": "Applied through LinkedIn"
}
```

### Success Response

**HTTP 200**

```json
{
  "success": true,
  "message": "Job listing updated successfully",
  "data": {}
}
```

---

## 6.5 Delete Saved Job

### Endpoint

```http
DELETE /jobs/:id
```

### Authentication

Required.

### Example

```http
DELETE /jobs/1
```

### Success Response

```json
{
  "success": true,
  "message": "Job listing deleted successfully"
}
```

---

# 7. Job Application APIs

Job applications are the core feature of the application.

Base path:

```text
/applications
```

All application endpoints require authentication.

---

## 7.1 Create Job Application

Creates a new job application.

### Endpoint

```http
POST /applications
```

### Authentication

Required.

### Request Body

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

### Fields

| Field | Type | Required | Description |
|---|---|---|---|
| companyId | Integer | Yes | ID of the company |
| jobListingId | Integer | No | Related saved job ID |
| jobTitle | String | Yes | Position applied for |
| status | String | No | Application status |
| appliedAt | Date | No | Application date |
| source | String | No | Application source |
| jobUrl | String | No | Job posting URL |

### Application Status Values

The backend application model supports:

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

### Success Response

**HTTP 201**

```json
{
  "success": true,
  "message": "Job application created successfully",
  "data": {
    "id": 1,
    "companyId": 1,
    "jobListingId": 2,
    "jobTitle": "Backend Developer",
    "status": "APPLIED",
    "appliedAt": "2026-08-18",
    "source": "LinkedIn",
    "jobUrl": "https://linkedin.com/jobs/123"
  }
}
```

---

## 7.2 Get Applications

Returns applications belonging to the authenticated user.

### Endpoint

```http
GET /applications
```

### Authentication

Required.

### Query Parameters

The application API supports query-based search/filtering and pagination.

| Parameter | Description |
|---|---|
| search | Search by application/company/job information |
| status | Filter by application status |
| companyId | Filter by company |
| from | Filter applications from a date |
| to | Filter applications until a date |
| page | Page number |
| limit | Number of records per page |
| sortBy | Sorting field |
| order | Sort direction |

### Example

```http
GET /applications?page=1&limit=10
```

### Search Example

```http
GET /applications?search=Google
```

### Status Filter Example

```http
GET /applications?status=INTERVIEW
```

### Date Filter Example

```http
GET /applications?from=2026-08-01&to=2026-08-18
```

### Combined Example

```http
GET /applications?search=Backend&status=INTERVIEW&page=1&limit=10
```

### Success Response

**HTTP 200**

```json
{
  "success": true,
  "data": {
    "applications": [],
    "pagination": {
      "totalItems": 0,
      "currentPage": 1,
      "itemsPerPage": 10,
      "totalPages": 0
    }
  }
}
```

---

## 7.3 Get Application By ID

Returns a single application.

### Endpoint

```http
GET /applications/:id
```

### Authentication

Required.

### Example

```http
GET /applications/1
```

### Success Response

**HTTP 200**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "companyId": 1,
    "jobTitle": "Backend Developer",
    "status": "INTERVIEW",
    "appliedAt": "2026-08-18",
    "source": "LinkedIn",
    "jobUrl": "https://example.com/job"
  }
}
```

---

## 7.4 Update Application

Updates an existing application.

### Endpoint

```http
PUT /applications/:id
```

### Authentication

Required.

### Example

```http
PUT /applications/1
```

### Request Body

```json
{
  "status": "INTERVIEW"
}
```

Another example:

```json
{
  "jobTitle": "Senior Backend Developer",
  "status": "OFFERED"
}
```

### Success Response

**HTTP 200**

```json
{
  "success": true,
  "message": "Application updated successfully",
  "data": {}
}
```

---

## 7.5 Delete Application

Deletes an application belonging to the authenticated user.

### Endpoint

```http
DELETE /applications/:id
```

### Authentication

Required.

### Example

```http
DELETE /applications/1
```

### Success Response

```json
{
  "success": true,
  "message": "Application deleted successfully"
}
```

---

# 8. Application Notes APIs

Notes allow users to record recruiter interactions, interview updates,
follow-ups and other information related to a job application.

All note endpoints require authentication.

---

## 8.1 Create Application Note

### Endpoint

```http
POST /applications/:applicationId/notes
```

### Authentication

Required.

### Path Parameter

| Parameter | Description |
|---|---|
| applicationId | Application ID |

### Request Body

```json
{
  "content": "Recruiter called. Technical interview scheduled for Monday."
}
```

### Success Response

**HTTP 201**

```json
{
  "success": true,
  "message": "Note created successfully",
  "data": {
    "id": 1,
    "applicationId": 10,
    "content": "Recruiter called. Technical interview scheduled for Monday."
  }
}
```

---

## 8.2 Get Application Notes

### Endpoint

```http
GET /applications/:applicationId/notes
```

### Authentication

Required.

### Example

```http
GET /applications/10/notes
```

### Success Response

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "applicationId": 10,
      "content": "Technical interview scheduled.",
      "createdAt": "2026-08-18T10:00:00.000Z"
    }
  ]
}
```

---

## 8.3 Update Note

### Endpoint

```http
PUT /notes/:id
```

### Authentication

Required.

### Request Body

```json
{
  "content": "Technical interview scheduled for Monday at 11 AM."
}
```

### Success Response

```json
{
  "success": true,
  "message": "Note updated successfully",
  "data": {}
}
```

---

## 8.4 Delete Note

### Endpoint

```http
DELETE /notes/:id
```

### Authentication

Required.

### Example

```http
DELETE /notes/1
```

### Success Response

```json
{
  "success": true,
  "message": "Note deleted successfully"
}
```

---

# 9. Attachment APIs

Attachments allow users to upload documents related to job applications,
such as resumes and cover letters.

The backend uses multipart form-data and the upload middleware.

---

## 9.1 Upload Attachment

### Endpoint

```http
POST /applications/:applicationId/attachments
```

### Authentication

Required.

### Content Type

```http
Content-Type: multipart/form-data
```

### Path Parameter

| Parameter | Description |
|---|---|
| applicationId | Application ID |

### Form Data

The upload field name must be:

```text
file
```

### Example

```text
file = resume.pdf
```

### Request

```http
POST /api/v1/applications/10/attachments
Authorization: Bearer <JWT_TOKEN>
Content-Type: multipart/form-data
```

Form-data:

```text
file: resume.pdf
```

### Success Response

```json
{
  "success": true,
  "message": "Attachment uploaded successfully",
  "data": {}
}
```

---

## 9.2 Get Application Attachments

Returns attachments associated with an application.

### Endpoint

```http
GET /applications/:applicationId/attachments
```

### Authentication

Required.

### Example

```http
GET /applications/10/attachments
```

### Success Response

```json
{
  "success": true,
  "data": []
}
```

---

## 9.3 Download Attachment

### Endpoint

```http
GET /attachments/:id/download
```

### Authentication

Required.

### Example

```http
GET /attachments/1/download
```

The endpoint returns the requested attachment/download response.

---

## 9.4 Delete Attachment

### Endpoint

```http
DELETE /attachments/:id
```

### Authentication

Required.

### Example

```http
DELETE /attachments/1
```

### Success Response

```json
{
  "success": true,
  "message": "Attachment deleted successfully"
}
```

---

# 10. Reminder APIs

Reminders allow users to schedule follow-ups for job applications.

All reminder endpoints require authentication.

---

## 10.1 Create Reminder

Creates a follow-up reminder for an application.

### Endpoint

```http
POST /applications/:applicationId/reminders
```

### Authentication

Required.

### Request Body

```json
{
  "title": "Follow up with recruiter",
  "message": "Ask about the interview result.",
  "reminderAt": "2026-08-18T18:30:00"
}
```

### Fields

| Field | Type | Required | Description |
|---|---|---|---|
| title | String | Yes | Reminder title |
| message | String | No | Reminder details |
| reminderAt | DateTime | Yes | Date and time when reminder becomes due |

### Success Response

**HTTP 201**

```json
{
  "success": true,
  "message": "Reminder created successfully",
  "data": {
    "id": 1,
    "title": "Follow up with recruiter",
    "message": "Ask about the interview result.",
    "reminderAt": "2026-08-18T18:30:00.000Z",
    "isCompleted": false,
    "emailSent": false
  }
}
```

---

## 10.2 Get Application Reminders

Returns reminders for a specific application.

### Endpoint

```http
GET /applications/:applicationId/reminders
```

### Authentication

Required.

### Example

```http
GET /applications/10/reminders
```

### Success Response

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "applicationId": 10,
      "title": "Follow up with recruiter",
      "message": "Ask about the interview result.",
      "reminderAt": "2026-08-18T18:30:00.000Z",
      "isCompleted": false,
      "emailSent": false
    }
  ]
}
```

---

## 10.3 Get All User Reminders

If the all-reminders route is enabled in the reminder router, this endpoint
returns all reminders belonging to the authenticated user.

### Endpoint

```http
GET /reminders
```

### Authentication

Required.

### Success Response

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "applicationId": 10,
      "title": "Follow up with recruiter",
      "message": "Ask about the interview result.",
      "reminderAt": "2026-08-18T18:30:00.000Z",
      "isCompleted": false,
      "emailSent": false
    }
  ]
}
```

> Note: Make sure `GET /reminders` is actually registered in
> `reminderRouter.js` before relying on this endpoint. The controller exists
> for this functionality, but the route must also be registered.

---

## 10.4 Update Reminder

Updates a reminder.

### Endpoint

```http
PUT /reminders/:id
```

### Authentication

Required.

### Example

```http
PUT /reminders/1
```

### Request Body

To manually complete a reminder:

```json
{
  "isCompleted": true
}
```

### Success Response

```json
{
  "success": true,
  "message": "Reminder updated successfully",
  "data": {}
}
```

---

## 10.5 Delete Reminder

Deletes a reminder.

### Endpoint

```http
DELETE /reminders/:id
```

### Authentication

Required.

### Example

```http
DELETE /reminders/1
```

### Success Response

```json
{
  "success": true,
  "message": "Reminder deleted successfully"
}
```

---

# 11. Dashboard API

The dashboard provides an overview of the user's job-search progress.

---

## 11.1 Get Dashboard Statistics

### Endpoint

```http
GET /dashboard
```

### Authentication

Required.

### Headers

```http
Authorization: Bearer <JWT_TOKEN>
```

### Success Response

```json
{
  "success": true,
  "data": {
    "totalApplications": 10,
    "applied": 5,
    "interviews": 2,
    "offers": 1,
    "rejected": 2,
    "responseRate": 50
  }
}
```

The exact statistics returned depend on the dashboard controller/service
implementation.

### Dashboard Purpose

The dashboard is used to visualize:

- Total applications
- Application status distribution
- Interview count
- Offer count
- Rejected applications
- Response rate
- Job-search progress

---

# 12. Search and Filtering

The application API supports search, filtering, pagination and sorting.

---

## 12.1 Search Applications

### Endpoint

```http
GET /applications?search=Google
```

The `search` parameter can be used to search application-related information
such as company names and job titles.

---

## 12.2 Filter By Status

```http
GET /applications?status=INTERVIEW
```

Example statuses:

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

---

## 12.3 Filter By Company

```http
GET /applications?companyId=1
```

---

## 12.4 Filter By Date Range

```http
GET /applications?from=2026-08-01&to=2026-08-18
```

---

## 12.5 Pagination

```http
GET /applications?page=1&limit=10
```

Where:

```text
page  = page number
limit = number of records per page
```

---

## 12.6 Sorting

Example:

```http
GET /applications?sortBy=appliedAt&order=DESC
```

---

## 12.7 Combined Search

Example:

```http
GET /applications?search=Backend&status=INTERVIEW&page=1&limit=10
```

---

# 13. Error Handling

The backend uses centralized error handling middleware.

Errors follow a common format.

## Example

```json
{
  "success": false,
  "message": "Application not found"
}
```

---

## Validation Error

Example:

```json
{
  "success": false,
  "message": "Validation failed"
}
```

---

## Authentication Error

Example:

```json
{
  "success": false,
  "message": "Authentication required"
}
```

---

## Resource Not Found

Example:

```json
{
  "success": false,
  "message": "Application not found"
}
```

---

# 14. HTTP Status Codes

| Status Code | Meaning |
|---|---|
| 200 | Request successful |
| 201 | Resource created successfully |
| 400 | Bad request / validation error |
| 401 | Authentication required / invalid token |
| 403 | Access forbidden |
| 404 | Resource not found |
| 409 | Conflict / duplicate resource |
| 500 | Internal server error |

---

# 15. API Testing

The APIs can be tested using:

- Postman
- Browser Developer Tools
- Frontend React application

---

## Recommended Testing Flow

### Step 1 — Register

```http
POST /api/v1/auth/register
```

### Step 2 — Login

```http
POST /api/v1/auth/login
```

Copy the JWT token from the response.

### Step 3 — Add JWT

For protected APIs:

```http
Authorization: Bearer <JWT_TOKEN>
```

### Step 4 — Create Company

```http
POST /api/v1/companies
```

### Step 5 — Create Job Listing

```http
POST /api/v1/jobs
```

### Step 6 — Create Application

```http
POST /api/v1/applications
```

### Step 7 — Add Note

```http
POST /api/v1/applications/:applicationId/notes
```

### Step 8 — Upload Attachment

```http
POST /api/v1/applications/:applicationId/attachments
```

Use `multipart/form-data`.

### Step 9 — Create Reminder

```http
POST /api/v1/applications/:applicationId/reminders
```

### Step 10 — Check Dashboard

```http
GET /api/v1/dashboard
```

---

# 16. Email Reminder System

The application supports automated email notifications for reminders.

## Reminder Flow

```text
User creates reminder
        |
        v
Reminder stored in MySQL
        |
        v
Scheduler checks reminders
        |
        v
reminderAt <= current time
        |
        v
SendGrid email service
        |
        v
User receives reminder email
        |
        v
Reminder email status updated
```

The scheduler checks for reminders that are due.

A reminder contains:

```text
title
message
reminderAt
isCompleted
emailSent
```

---

## Email Notification Conditions

A reminder is eligible for processing when:

```text
reminderAt <= current time
AND
isCompleted = false
AND
emailSent = false
```

After successful email processing, the reminder's email status is updated.

If automatic completion is enabled in the scheduler, the reminder can also be
marked as:

```text
isCompleted = true
```

after the email is successfully sent.

---

## Important

The email service uses SendGrid.

Required environment variables:

```env
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=your_verified_sender_email
```

The sender email must be verified with SendGrid.

---

# 17. Security

## JWT Authentication

Protected endpoints require:

```http
Authorization: Bearer <JWT_TOKEN>
```

---

## User Data Isolation

User-owned resources are associated with the authenticated user's ID.

Examples:

- Applications
- Companies
- Saved jobs
- Notes
- Reminders
- Attachments
- Profile

The backend uses the authenticated user's ID when accessing these resources.

This prevents one user from accessing another user's data.

---

## Password Security

Passwords are hashed before being stored in the database.

Passwords should never be returned in API responses.

---

## Environment Variables

Sensitive values must be stored in `.env`.

Examples:

```env
JWT_SECRET=...
DB_PASSWORD=...
SENDGRID_API_KEY=...
AWS_SECRET_ACCESS_KEY=...
```

Do not commit `.env` to GitHub.

---

# API Endpoint Summary

| Module | Method | Endpoint | Auth |
|---|---|---|---|
| Auth | POST | `/auth/register` | No |
| Auth | POST | `/auth/login` | No |
| Profile | GET | `/profile/me` | Yes |
| Profile | PUT | `/profile/me` | Yes |
| Companies | POST | `/companies` | Yes |
| Companies | GET | `/companies` | Yes |
| Companies | GET | `/companies/:id` | Yes |
| Companies | PUT | `/companies/:id` | Yes |
| Companies | DELETE | `/companies/:id` | Yes |
| Jobs | POST | `/jobs` | Yes |
| Jobs | GET | `/jobs` | Yes |
| Jobs | GET | `/jobs/:id` | Yes |
| Jobs | PUT | `/jobs/:id` | Yes |
| Jobs | DELETE | `/jobs/:id` | Yes |
| Applications | POST | `/applications` | Yes |
| Applications | GET | `/applications` | Yes |
| Applications | GET | `/applications/:id` | Yes |
| Applications | PUT | `/applications/:id` | Yes |
| Applications | DELETE | `/applications/:id` | Yes |
| Notes | POST | `/applications/:applicationId/notes` | Yes |
| Notes | GET | `/applications/:applicationId/notes` | Yes |
| Notes | PUT | `/notes/:id` | Yes |
| Notes | DELETE | `/notes/:id` | Yes |
| Attachments | POST | `/applications/:applicationId/attachments` | Yes |
| Attachments | GET | `/applications/:applicationId/attachments` | Yes |
| Attachments | GET | `/attachments/:id/download` | Yes |
| Attachments | DELETE | `/attachments/:id` | Yes |
| Reminders | POST | `/applications/:applicationId/reminders` | Yes |
| Reminders | GET | `/applications/:applicationId/reminders` | Yes |
| Reminders | GET | `/reminders`* | Yes |
| Reminders | PUT | `/reminders/:id` | Yes |
| Reminders | DELETE | `/reminders/:id` | Yes |
| Dashboard | GET | `/dashboard` | Yes |

\* `GET /reminders` should be included only after the corresponding route is
registered in `reminderRouter.js`.

---

# Complete API Base URL Examples

Local backend:

```text
http://localhost:3000
```

API:

```text
http://localhost:3000/api/v1
```

Authentication:

```text
http://localhost:3000/api/v1/auth/login
```

Applications:

```text
http://localhost:3000/api/v1/applications
```

Companies:

```text
http://localhost:3000/api/v1/companies
```

Saved Jobs:

```text
http://localhost:3000/api/v1/jobs
```

Dashboard:

```text
http://localhost:3000/api/v1/dashboard
```

---

# Conclusion

The Job Application Tracker API provides a complete backend for managing the
job-search process.

The API supports:

- Secure user authentication
- Profile management
- Company management
- Saved job listings
- Job application tracking
- Application status updates
- Search and filtering
- Pagination
- Notes
- Resume and document attachments
- Follow-up reminders
- Email notifications
- Dashboard statistics
- User-specific data access

The API is designed using REST principles and follows a layered
Express/Sequelize backend architecture.