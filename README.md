# Twitter Backend API

This is a backend service for a Twitter-like application built using NestJS. It includes basic functionalities such as user management, tweet posting, liking, retweeting, and user follow/unfollow features. The service uses PostgreSQL for data storage, TypeORM for database operations, and Firebase for authentication.



## Prerequisites
---------------

* Node.js 18+ version
* Docker & Docker Compose (optional but recommended)

## Setup Instructions
### 1. Clone the Repository
First, clone the repository to your local machine:
```
git clone https://github.com/aljithkj02/twitter-backend.git
cd twitter-backend
```

### 2. Configure Firebase
For authentication, Firebase configuration files are required. Place the following files in the 
```
directory: twitter-backend/src/infrastructure/firebase/certificates 
```
```
# File names
firebase-client-config.json
firebase-service-account-key.json
```
You can obtain these files from your Firebase project settings.

### 3. Set Up Environment Variables
Copy the .env.example file to create a new .env file:
```
cp .env.example .env
```
Update the .env file with your PostgreSQL database credentials and other necessary environment variables.

### 4. Set Up PostgreSQL Database
You can use Docker to run PostgreSQL by using the provided docker-compose.yml file. Update the credentials in the docker-compose.yml file located in the root directory. Then, start the PostgreSQL server with:
```
docker-compose up -d
```
Alternatively, you can set up PostgreSQL manually if you prefer.

### 5. Install Dependencies
Install the required Node.js dependencies:
```
npm install
```

### 6. Run the Application
To start the application in development mode, use:
```
npm run start:dev
```
The application will be accessible at http://localhost:3000/api.

### 7. Build the Application
To build the application for production, use:
```
npm run build
```

### 8. Run in Production
To start the application in production mode, use:
```
npm run start
```

### 9. API Documentation
Swagger has been integrated for API documentation. You can access the documentation at http://localhost:3000/api-docs.