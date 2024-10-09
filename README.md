# task-user-crud-cma

This project is a simple user management system built with a .NET Core back-end and an Angular front-end. The application allows users to create and read user data, integrates with MongoDB for data storage, and considers GDPR compliance aspects.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [GDPR Compliance](#gdpr-compliance)
- [Contributing](#contributing)
- [License](#license)

## Features

- Create and read user data.
- Responsive user interface built with Angular and Bootstrap.
- Integration with MongoDB for data storage.
- Basic GDPR compliance measures.
- Pagination for user listing.

## Technologies Used

- **Frontend**: Angular, Bootstrap, HTML, CSS, TypeScript
- **Backend**: .NET Core, C#, MongoDB
- **Database**: MongoDB
- **Tools**: Visual Studio, Visual Studio Code, Postman

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [Angular CLI](https://angular.io/cli) (install via `npm install -g @angular/cli`)
- [.NET Core SDK](https://dotnet.microsoft.com/download) (v5 or higher)
- [MongoDB](https://www.mongodb.com/) (install locally or use a cloud instance)

### Backend Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd backend
   
   
## Install dependencies
    dotnet restore


## Configure MongoDB
	"ConnectionStrings": {
    "MongoDb": "mongodb://localhost:27017/userdb"
}

## Run the application
	dotnet run


## Frontend Setup

### Navigate to the frontend directory
	cd frontend

### Install dependencies
	npm install

### Run the application
	ng serve --open

