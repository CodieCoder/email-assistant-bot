# Email Assistant - Intelligent Email Processing

This project is an intelligent email assistant built using NestJS, TypeScript, and Groq's LLM API. It analyzes incoming emails, extracts key information, categorizes them, run functions based on the analysis and provides insights based on the email content and the sender's history.

## Features

- **Email Analysis:** Uses Groq's LLM to analyze email content and extract relevant information.
- **Categorization:** Automatically categorizes emails into predefined tags (e.g., purchase, payment, inquiry, complaint, etc.).
- **Sender History:** Considers the sender's history and past interactions to provide more accurate analysis.
- **Sentiment Analysis:** Determines the overall sentiment (positive, negative, neutral) and emotional tone of the email.
- **Confidence Scoring:** Assigns confidence scores to each category, indicating the certainty of the categorization.
- **Post-Processing:** Supports custom post-processing logic for handling emails based on their tags.
- **Database Integration:** Uses PostgreSQL to store email data, sender information, and analysis results.
- **Modular Design:** Built with NestJS's modular architecture for maintainability and scalability.
- **Type safety:** Uses Typescript to ensure type safety.
- **Dependency Injection:** Uses NestJS dependency injection to ensure loose coupling.
- **Configuration Management:** Uses NestJS ConfigModule to manage environment variables.

## Technologies Used

- **NestJS:** A progressive Node.js framework for building efficient and scalable server-side applications.
- **TypeScript:** A statically typed superset of JavaScript that enhances code quality and maintainability.
- **Groq:** A high-performance LLM API for natural language processing.
- **PostgreSQL:** A powerful, open-source relational database for data persistence.
- **TypeORM:** An Object-Relational Mapping (ORM) library for TypeScript and JavaScript.
- **Node.js:** A JavaScript runtime environment.
- **dotenv:** To manage environment variables.

## Project Structure

email-assistant/
├── src/
│ ├── app/
│ │ ├── message/ # Email processing logic
│ │ │ ├── message.module.ts # Email module
│ │ │ ├── message.service.ts # Email processing service
│ │ │ └── message.dto.ts # Email data transfer objects
│ │ ├── llm/ # LLM integration
│ │ │ ├── llm.module.ts # LLM module
│ │ │ ├── llm.service.ts # LLM service (Groq integration)
│ │ │ └── llm.dto.ts # LLM data transfer objects
│ │ ├── sender/ # Sender management
│ │ │ └── sender.service.ts # Sender service
│ │ ├── ... # Other app-specific modules (if any)
│ │ ├── app.controller.ts # Main controller
│ │ ├── app.module.ts # Main module
│ │ └── app.service.ts # Main service
│ ├── config/
│ │ └── database/
│ │ └── postgres.config.database.ts # Database configuration
│ ├── entities/ # Database entities
│ │ ├── message.entity.ts # Email message entity
│ │ └── message-sender.entity.ts # Message sender entity
│ ├── lib/
│ │ ├── entity/
│ │ │ └── entity.base.ts # Base entity class
│ │ └── constants/
│ │ ├── index.ts # Constants index
│ │ └── placeholders.ts # Placeholder constants
│ ├── main.ts # Entry point
│ └── ... # Other files in src (if any)
├── test/ # End-to-end tests
│ └── app.e2e-spec.ts # End-to-end test file
├── .env # Environment variables
├── .gitignore # Git ignore file
├── package.json # Project dependencies
├── tsconfig.json # TypeScript configuration
└── README.md # Project documentation

## Setup and Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd email-assistant
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Environment Variables:**

    - Create a `.env` file in the root directory.
    - Add the following variables:

    ```
    POSTGRES_HOST=localhost
    POSTGRES_PORT=5432
    POSTGRES_DB=email-assistant
    POSTGRES_USER=postgres
    POSTGRES_PASSWORD=postgres
    GROQ_API_KEY=<your-groq-api-key>
    ```

    - Replace `<your-groq-api-key>` with your actual Groq API key.

4.  **Database Setup:**

    - Ensure you have PostgreSQL installed and running.
    - The database configuration is in `src/config/database/postgres.config.database.ts`.
    - The application will automatically create the database and tables based on the entities defined in the `src/entities` directory.

5.  **Run the app**
    ```bash
    npm run start:dev
    ```

## Running the Application

1.  **Development Mode:**

    ```bash
    npm run start:dev
    ```

2.  **Production Mode:**

    ```bash
    npm run build
    npm run start:prod
    ```

## Key Components

### 1. LLM Integration (`src/app/llm/`)

- **`llm.module.ts`:** Defines the `LLMModule` for managing the LLM service.
- **`llm.service.ts`:**
  - Handles communication with the Groq API.
  - `analyzeEmail()`: Sends the email content and context to Groq for analysis.
  - `buildPrompt()`: Constructs the prompt for the LLM, including instructions and context.
  - `parseResponse()`: Parses the JSON response from Groq.
- **`llm.dto.ts`:** Defines the data transfer objects for the LLM interaction, including `IAITagReport`, `ISentimentReport`, `IAITagReportObject`, and `ILLMResponse`.

### 2. Email Processing (`src/app/email/`)

- **`message.module.ts`:** Defines the `MessageModule` for managing email processing.
- **`message.service.ts`:**
  - `processNewEmail()`: Processes a new email, checks if it has already been processed, gets or creates the sender, builds the context, sends the email to the LLM for analysis, saves the results to the database, and runs post-processing tools.
  - `buildContext()`: Builds the context for the LLM, including the sender's summary and recent messages.
  - `formatAIConfidenceReport()`: Formats the AI report for confidence.
  - `determineTag()`: Determines the email tags based on the AI report.
  - `runPostProcessingTools()`: Placeholder for post-processing logic.
  - `formatResponse()`: Formats the response for the client.
- **`message.dto.ts`:** Defines the data transfer objects for email processing, including `EmailDto`, `ProcessedMessageDto`, and `IMessageContext`.

### 3. Sender Management (`src/app/sender/`)

- **`sender.service.ts`:**
  - `getOrCreateSender()`: Retrieves an existing sender or creates a new one.

### 4. Database Entities (`src/entities/`)

- **`email.entity.ts`:** Defines the `MessageEntity` for storing email data.
- **`email-sender.entity.ts`:** Defines the `Sender` entity for storing sender information.
- **`entity.base.ts`:** Defines the base entity class for common fields.

### 5. Constants (`src/lib/constants/`)

- **`placeholders.ts`:** Defines placeholder values for AI reports.

### 6. Main Application (`src/`)

- **`app.module.ts`:** The root module of the application, configuring the database and other modules.
- **`app.service.ts`:** Contains the main application logic, including handling emails based on their tags.
- **`app.controller.ts`:** The main controller for handling HTTP requests.
- **`main.ts`:** The entry point of the application.

### 7. Configuration (`src/config/`)

- **`postgres.config.database.ts`:** Contains the database configuration.

## Data Flow

1.  A new email arrives (simulated by sending an `EmailDto`).
2.  `MessageService.processNewEmail()` is called.
3.  The service checks if the email has already been processed.
4.  It retrieves or creates the sender using `SenderService`.
5.  It builds the context for the LLM using `MessageService.buildContext()`.
6.  It calls `LLMService.analyzeEmail()` to analyze the email.
7.  `LLMService` constructs a prompt, sends it to Groq, and parses the response.
8.  The response is saved to the database.
9.  `MessageService.determineTag()` determines the email tags.
10. `MessageService.runPostProcessingTools()` is called.
11. The processed email is returned.
12. `AppService.handleEmail()` is called to handle the email based on its tag.

## Testing

- **End-to-End Tests:** The `test/app.e2e-spec.ts` file contains an example end-to-end test.

## Future Improvements

- **More Robust Error Handling:** Implement more comprehensive error handling for various scenarios.
- **Advanced Post-Processing:** Develop more sophisticated post-processing logic.
- **Real-time Email Integration:** Integrate with a real email server to process incoming emails in real-time.
- **User Interface:** Create a user interface for interacting with the email assistant.
- **More tests:** Add more tests to ensure the quality of the code.
- **More models:** Add support for more models.

## Contributing

PRIVATE REPO
