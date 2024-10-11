# Task User CRUD CMA

## Overview
The Task User CRUD CMA is a user management system designed with a .NET Core backend and an Angular front-end. This application enables users to create, read, update, and delete user data while integrating with MongoDB for data storage. Additionally, it incorporates basic GDPR compliance measures to protect user data.

## Table of Contents
1. Features
2. Technologies Used
3. Getting Started
   - Prerequisites
   - Backend Setup
   - Frontend Setup
4. Usage
5. API Endpoints
6. GDPR Compliance
7. Contributing
8. License

## Features
- Create, read, update, and delete user data.
- Responsive user interface built with Angular and Bootstrap.
- Integration with MongoDB for efficient data storage.
- Basic measures for GDPR compliance.
- Pagination for streamlined user listing.

## Technologies Used
- **Frontend**: Angular, Bootstrap, HTML, CSS, TypeScript
- **Backend**: .NET Core, C#
- **Database**: MongoDB
- **Tools**: Visual Studio, Visual Studio Code, Postman

## Getting Started

### Prerequisites
To set up the application, ensure you have the following installed:
- Node.js (v14 or higher)
- Angular CLI (install via `npm install -g @angular/cli`)
- .NET Core SDK (v5 or higher)
- MongoDB (install locally or use a cloud instance)

### Backend Setup
1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd backend
   ```
2. **Install Dependencies**:
   ```bash
   dotnet restore
   ```
3. **Configure MongoDB**:
   Update your `appsettings.json` with the MongoDB connection string:
   ```json
   "ConnectionStrings": {
       "MongoDb": "mongodb://localhost:27017/userdb"
   }
   ```
4. **Run the Application**:
   ```bash
   dotnet run
   ```
5. **Obtain the API Port**:
   After executing the API project get the port number on which the .NET API is running on the browser. This port number is essential for configuring the frontend services to communicate with the backend.

### Frontend Setup
1. **Navigate to the Frontend Directory**:
   ```bash
   cd frontend
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Configure the Base URL**:
   Update the following files with the API base URL, replacing `<your port>` with the port number obtained from the API project:
   - **auth.service.ts**:
     ```typescript
     baseUrl = 'https://localhost:<your port>/api/User';
     ```
   - **login.component.ts**:
     ```typescript
     baseUrl = 'https://localhost:<your port>/api/User';
     ```
   - **user.services.ts**:
     ```typescript
     baseUrl = 'https://localhost:<your port>/api/User';
     ```
   - **UserAPI.http**:
     ```http
     @UserAPI_HostAddress = https://localhost:<your port>
     ```
4. **Update launchSettings.json**:
   Modify `launchSettings.json` in your backend project to ensure the correct application URL:
   ```json
   "profiles": {
       "applicationUrl": "https://localhost:<your port>",
       "https": {
           "applicationUrl": "https://localhost:<your port>"
       }
   }
   ```

5. **Run the Application**:
   ```bash
   ng serve --open
   ```

## Usage
Once the application is running, navigate to the front-end interface to manage user data. The interface allows you to create new users, view existing user records, update user details, and delete users.

## API Endpoints
The backend exposes several API endpoints for user management. Key endpoints include:
- `GET /api/users`: Retrieve a list of users.
- `POST /api/users`: Create a new user.
- `GET /api/users/{id}`: Retrieve a user by ID.
- `PUT /api/users/{id}`: Update a user by ID.
- `DELETE /api/users/{id}`: Delete a user by ID.

## GDPR Compliance
The application incorporates basic measures for GDPR compliance:

1. Right to Access
Provide functionality for users to view their data. The front-end should allow users to see the personal information stored in the system.
Implement an endpoint to return the user's data in a machine-readable format, such as JSON.
2. Right to Rectification
Allow users to update their personal information. This can be implemented later but should be considered in the initial design to facilitate future CRUD operations beyond Create and Read.
3. Right to Erasure (Right to be Forgotten)
Implement a deletion mechanism that allows users to request the deletion of their personal data. This could be a simple delete operation on the server-side API.
Make sure the data is permanently removed from the database and not merely flagged as deleted.
4. Data Anonymization
If deletion is not immediately possible (e.g., for audit purposes), anonymize the personal data instead. For example, you could replace a user's name and email with random strings.
5. Data Portability
Enable users to download their data in a portable format (e.g., JSON or CSV). This could be provided as an additional API endpoint.
6. Data Security
Ensure that data is transmitted securely using HTTPS.
Apply encryption to sensitive data (e.g., passwords if you have authentication). Passwords should be hashed using a strong algorithm like bcrypt.
7. Logging and Auditing
Maintain an audit log of user data access and modifications for accountability purposes. This log should not include personal data, just the activity details.