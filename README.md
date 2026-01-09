This is the backend application for a Drive-like file storage system.

The backend is responsible for authentication, file and folder management,
permissions logic and API access. The project was built as a pet project /
test assignment with a focus on architecture and access control.

## Swagger documentations url is "http://localhost:3000/api"

## Getting Started

Firstly, you need to create a new project in google console in order to receive Google-client-id and Google-client-secret for OAuth

The second step is to create database in postgresSQL

The next you should to do is creating .env file in root directory and fill appropriate variables, for example:
DATABASE_URL="postgresql://root:root@localhost:5432/drive" - you need insert your connection link here

GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
JWT_SECRET=""

BACKEND_URL="http://localhost:3000"
FRONTEND_URL="http://localhost:3001"

Next, you need to install the dependencies:

```bash
npm install
```

After that run the following commands but make sure that all env variables is correct
```bash
npx prisma generate
npx prisma migrate dev
```

So project is ready to test, run command:
```bash
npm run start:dev
```

## Features

### Authentication
- **User registration and login**: Users can register and log in to access their accounts.
- **JWT-based authentication**: Secure authentication using JSON Web Tokens.
- **Optional Google OAuth login**: Users can authenticate via Google OAuth if configured.

### Files & Folders
- **File upload and storage**: Allows users to upload and store files on the server.
- **Folder hierarchy**: Supports a parent-child folder structure to organize files.
- **CRUD operations**: Users can create, rename, and delete files and folders.

### Sharing & Permissions
- **Share files and folders**: Users can share files and folders with others via email.
- **Permission roles**:
  - `viewer` — read-only access.
  - `editor` — read and write access.
- **Synchronized permissions**: Permissions are synchronized in a single request for consistency.
- **Owner access**: The owner always has full access to their files and folders.

---

## Architecture Notes
- **Business logic**: Implemented in services to separate concerns and maintain clean code.
- **Controllers**: Controllers are kept thin, only handling request and response logic.
- **DTOs (Data Transfer Objects)**: DTOs are isolated from Prisma models to improve architecture and maintainability.
- **Permissions module**: Permissions logic is centralized in the Permissions module for easier management and scalability.
