# Email Assistant - AI-Powered Email Management

Email Assistant is an intelligent email processing tool built with **NestJS**, **TypeScript**, and **Groq's LLM API**. It helps users analyze, categorize, and extract insights from incoming emails, leveraging AI to improve email workflow efficiency.

## 🚀 Features

- **AI-Powered Email Analysis:** Uses Groq's LLM to extract key information from emails.
- **Automated Categorization:** Classifies emails into predefined categories (e.g., purchase, payment, inquiry, complaint, etc.).
- **Sender History Tracking:** Considers past interactions for more context-aware analysis.
- **Sentiment Analysis:** Detects the overall sentiment (positive, negative, neutral) and emotional tone of the email.
- **Confidence Scoring:** Assigns confidence scores to each categorization for transparency.
- **Custom Post-Processing:** Allows users to define workflows for handling categorized emails.
- **Database Integration:** Uses PostgreSQL to store email data, sender history, and analysis results.
- **Secure Authentication:** Implements JWT-based authentication with role-based access control.
- **Structured Logging:** Custom logging service for better monitoring and debugging.
- **API Documentation:** Auto-generates Swagger API documentation for easy testing and integration.
- **Modular Architecture:** Built with NestJS's modular design for maintainability and scalability.

## 🛠 Technologies Used

- **NestJS** - Scalable Node.js framework.
- **TypeScript** - Enhances code quality with static typing.
- - **BullMQ** - Used for queueing tasks.
- **Groq API** - LLM API for natural language processing.
- **PostgreSQL** - Relational database for storing email data.
- **TypeORM** - ORM for database interactions.
- **JWT** - Secure authentication mechanism.
- **Swagger** - API documentation and testing.
- **dotenv** - Environment variable management.

## 📂 Project Structure

```
email-assistant/
├── src/
│   ├── app/
│   │   ├── auth/         # Authentication logic
│   │   ├── emailer/      # Email sending logic
│   │   ├── llm/          # LLM integration
│   │   ├── message/      # Email processing logic
│   │   ├── sender/       # Sender management
│   │   ├── user/         # User management
│   │   ├── app.controller.ts  # Main controller
│   │   ├── app.module.ts      # Main module
│   │   └── app.service.ts     # Main service
│   ├── config/         # Configuration files
│   │   ├── database/   # Database configuration
│   │   └── global/     # Global configuration
│   ├── entities/       # Database entities
│   ├── lib/            # Shared utilities and modules
│   │   ├── constants/  # Application constants
│   │   ├── entity/     # Base entity class
│   │   └── logger/     # Custom logging service
│   ├── main.ts         # Entry point
│   └── ...
├── test/              # End-to-end tests
├── .env               # Environment variables
├── .gitignore         # Git ignore file
├── package.json       # Project dependencies
├── tsconfig.json      # TypeScript configuration
└── README.md          # Project documentation
```

## 🔧 Setup & Installation

### 1️⃣ Clone the Repository

```bash
git clone <repository-url>
cd email-assistant
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Configure Environment Variables

Create a `.env` file in the project root and add the following:

```
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=email_assistant
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
GROQ_API_KEY=<your-groq-api-key>
JWT_SECRET=<your-jwt-secret>
HASH_SALT=10
PORT=8000
```

Replace `<your-groq-api-key>` and `<your-jwt-secret>` with actual values.

### 4️⃣ Database Setup

Ensure PostgreSQL is installed and running. The database configuration is located in:

```
src/config/database/postgres.config.database.ts
```

### 5️⃣ Run the Application

For development mode:

```bash
npm run start:dev
```

For production mode:

```bash
npm run build
npm run start:prod
```

## 🛠 Key Modules

### 1. **Authentication (`src/app/auth/`)**

- Implements JWT-based authentication.
- Manages user login, registration, and role-based access control.

### 2. **LLM Integration (`src/app/llm/`)**

- Connects with Groq's LLM API for email analysis.
- Structures responses for efficient processing.

### 3. **Email Processing (`src/app/message/`)**

- Handles email parsing, analysis, and categorization.
- Stores processed data in PostgreSQL.

### 4. **Sender Management (`src/app/sender/`)**

- Maintains sender profiles and historical interactions.

### 5. **Logging (`src/lib/logger/`)**

- Custom logging service for structured logs.
- Middleware for request logging.

### 6. **Configuration (`src/config/`)**

- Manages environment variables and database configurations.

## 📄 API Documentation

- **Swagger API Documentation** is available at:  
  **`http://localhost:8000/api/docs`**

## ✅ Testing

Run unit tests:

```bash
npm run test
```

Run end-to-end tests:

```bash
npm run test:e2e
```

## 🔮 Future Improvements

- **📩 Real-time Email Integration:** Process emails in real-time from inboxes.
- **🤖 Automated Replies:** AI-generated email responses.
- **📊 Dashboard UI:** Web interface for managing email insights.
- **🔒 Enhanced Security:** Features like rate limiting and IP whitelisting.
- **📡 Webhook Support:** Trigger external actions based on email analysis.

## 🤝 Contributing

This is a private repository. Contributions are currently not accepted.

---

📬 **Email Assistant** - Smart email management with AI insights.
