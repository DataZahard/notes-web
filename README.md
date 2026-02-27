# Notes-Web: Scalable Auth & CRUD System

​A high-performance Full-Stack application featuring secure JWT Authentication and Role-Based Access Control (RBAC). Developed for the Anything.ai Backend Assessment.

### ​🚀 Quick Start (One-Click Setup)

To get the project running locally, copy and paste the following commands:

## ​1. Clone & Setup
```bash
git clone https://github.com/DataZahard/notes-web.git
cd notes-web
npm install
```

### 2. Install Dependencies
```bash
npm install
```

(Note: Dependencies are listed in package.json. A requirements.txt file is also provided for reference.)

### ​3. Start the Server
```bash
node server.js
```

### The application will be live at: http://localhost:3000

## ​🛠️ Technical Architecture

**Backend:**Node.js & Express.js with API versioning (/api/v1/).
**Database:**NeDB (Persistent JSON-based local storage).
**Security:**
Password hashing via Bcrypt.js
Stateless authentication via JWT.
Role-based middleware to restrict Admin vs. User routes.

## ​📈 Scalability Note

To move this from a MVP to a production-grade system:

**DB:**Swap NeDB for MongoDB/Postgres to handle high-volume concurrent writes.
**Cache:**Use Redis for session blacklisting and high-speed data retrieval.
**Infrastructure:**Deploy via Docker containers to a Kubernetes cluster for auto-scaling.

## ​📄 API Documentation

Refer to api-docs.json for a full list of endpoints including Request/Response schemas.

