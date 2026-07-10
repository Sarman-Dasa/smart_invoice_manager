# Smart Invoice Manager with AI-Powered Payment Reminder Drafts

<div align="center">
  <h3>A modern, robust SaaS boilerplate for managing clients, invoices, and automated AI payment reminders.</h3>
</div>

---

## 1. Project Overview

**Smart Invoice Manager** is a full-stack, multi-tenant web application designed to simplify the invoicing lifecycle for freelancers and small businesses. It features an intuitive client and invoice management system, dynamic status tracking, and a seamless dashboard. 

What sets this project apart is its **AI-Powered Payment Reminder System**. Utilizing the Google Gemini API, the application streams real-time, professionally drafted payment reminders. These drafts can be reviewed, edited, and dispatched directly via email using Laravel's robust queueing system.

## 2. Features

- **User Registration & Login**: Secure authentication powered by Laravel Breeze.
- **Multi-tenant Architecture**: Strict data isolation ensuring users only access their own clients and invoices.
- **Client Management (CRUD)**: Create, read, update, and delete client profiles.
- **Invoice Management (CRUD)**: Full invoice lifecycle management.
- **Auto-generated Invoice Numbers**: Unique identifiers (e.g., `INV-00001`) automatically assigned upon creation.
- **Dynamic Invoice Status**: Automatically computes status (`Paid`, `Pending`, or `Overdue`) based on dates.
- **Dashboard Statistics**: Aggregate views of total clients, invoices, and financial status.
- **AI-Powered Reminder Generation**: Leverages Google Gemini to draft personalized, professional payment reminders.
- **Real-time AI Streaming**: Utilizes Server-Sent Events (SSE) to stream AI responses instantly to the React UI.
- **Reminder History Tracking**: Keeps a comprehensive log of generated drafts and sent emails.
- **Email Reminder Sending**: Dispatch professional HTML emails directly to clients.
- **Queue-based Email Processing**: Ensures non-blocking UI experiences through Laravel background jobs.

## 3. Technology Stack

### Backend
- **Laravel 12**: PHP web framework for robust routing, controllers, and ORM.
- **MySQL 8**: Relational database for structured data storage.
- **Google Gemini API**: Advanced LLM for generating contextual reminder drafts.

### Frontend
- **React 18**: Modern JavaScript library for building interactive user interfaces.
- **Inertia.js v2**: Glues Laravel and React together without building an API, using standard routing.
- **Bootstrap 5.3**: Responsive, mobile-first CSS framework for a clean, professional aesthetic.

### Infrastructure & Tools
- **Laravel Queues**: Background job processing (Sync/Database/Redis).
- **Laravel Mail**: Mailable classes with custom HTML templates.
- **PHPUnit**: Feature and unit testing for maximum reliability.

## 4. System Architecture

The application strictly adheres to the MVC (Model-View-Controller) architecture, enhanced by modern Service classes:

- **Controllers**: Kept incredibly thin, responsible only for HTTP request handling and Inertia render payloads.
- **Service Layer**: Business logic (like AI generation and Prompt building) is extracted into dedicated Service classes (e.g., `GeminiAiService`, `PromptBuilder`).
- **Interfaces**: Employs contracts (`AiGeneratorInterface`) to allow seamless swapping of AI providers in the future.
- **Queued Jobs**: Email dispatching is offloaded to `SendPaymentReminderJob`, featuring automated retries and failure logging.
- **Event Streaming**: Bypasses standard request-response cycles to stream LLM generation directly to the frontend using PHP output buffers and SSE.

## 5. Installation Guide

Follow these steps to get the application running locally.

### Prerequisites
Ensure your local machine has the following installed:
- PHP 8.2 or higher
- Composer
- Node.js (v18+) and npm
- MySQL 8

### Clone the Repository
```bash
git clone https://github.com/yourusername/smart-invoice-manager.git
cd smart-invoice-manager
```

### Install Dependencies
```bash
# Install PHP dependencies
composer install

# Install Node.js dependencies
npm install
```

## 6. Environment Configuration

Duplicate the example environment file and configure it:

```bash
cp .env.example .env
php artisan key:generate
```

Open `.env` and configure the following key sections.

## 7. Database Setup

Configure your MySQL connection in `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=smart_invoice_manager
DB_USERNAME=root
DB_PASSWORD=your_password
```

Run the migrations and seed the database (optional):
```bash
php artisan migrate
```

## 8. Gemini API Setup

Obtain an API key from Google AI Studio and configure it in `.env`. Ensure you use a model version supported by your key tier (e.g., `gemini-flash-latest`, `gemini-2.0-flash`, or `gemini-2.5-flash`).

```env
GEMINI_API_KEY=your_google_gemini_api_key_here
GEMINI_MODEL=gemini-flash-latest
```

## 9. Queue Setup

To process emails asynchronously, configure your queue driver. For local development, `database` is recommended.

```env
QUEUE_CONNECTION=database
```

Run the queue table migration (if not already run):
```bash
php artisan queue:table
php artisan migrate
```

## 10. Mail Configuration

Configure your SMTP settings to dispatch payment reminders. You can use Mailtrap or any standard SMTP provider during development.

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_mailtrap_username
MAIL_PASSWORD=your_mailtrap_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="billing@smartinvoices.com"
MAIL_FROM_NAME="${APP_NAME}"
```

## 11. Running the Application

To run the application locally, you need three separate terminal processes.

**Terminal 1: Start the Laravel PHP Server**
```bash
php artisan serve
```

**Terminal 2: Start the Vite Dev Server (React/CSS compilation)**
```bash
npm run dev
```

**Terminal 3: Start the Laravel Queue Worker**
```bash
php artisan queue:work
```

Navigate to `http://127.0.0.1:8000` in your browser.

## 12. Demo Credentials

If you utilized Database Seeders, you can log in using the following:

**Email**: `admin@example.com`
**Password**: `password` (or your custom seeded password)

## 13. Folder Structure

```text
├── app/
│   ├── Contracts/        # Interfaces (e.g., AiGeneratorInterface)
│   ├── Http/
│   │   └── Controllers/  # Route Controllers (e.g., AiController, InvoiceController)
│   ├── Jobs/             # Queued Jobs (e.g., SendPaymentReminderJob)
│   ├── Mail/             # Mailable Classes
│   ├── Models/           # Eloquent Models
│   └── Services/         # Business Logic (AI, Prompts)
├── database/
│   ├── factories/        # Model Factories for testing
│   └── migrations/       # Database schemas
├── resources/
│   ├── js/
│   │   ├── Components/   # Reusable React components (Modals, Buttons)
│   │   ├── Layouts/      # Inertia Layout wrappers
│   │   └── Pages/        # Main Inertia Views (Dashboard, Invoices, Clients)
│   └── views/
│       └── emails/       # Blade templates for HTML emails
├── routes/
│   └── web.php           # Application web routes
└── tests/
    └── Feature/          # Comprehensive PHPUnit feature tests
```