# Task User CRUD CMA
## Overview
The Task User CRUD CMA is a user management system designed with a .NET Core backend and an Angular front-end. This application enables users to create, read, update and delete user data while integrating with MongoDB for data storage. Additionally, it incorporates basic GDPR compliance measures to protect user data.
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
### Frontend Setup
1. **Navigate to the Frontend Directory**:
   ```bash
   cd frontend
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Run the Application**:
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
The application incorporates basic measures for GDPR compliance, such as user consent for data storage and options for data retrieval and deletion. 