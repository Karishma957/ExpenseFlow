# ExpenseFlow: Global Tracker

Live link: https://expense-flow-c6pa5czmr-karishma957s-projects.vercel.app/

## Project Demo
[Click here to watch the ExpenseFlow Demo](./ExpenseTracker.mp4)

ExpenseFlow is a professional-grade full-stack dashboard built with Next.js 16 and Django REST Framework. It features a centered, high-breathability UI designed to track expenses across different currencies with real-time analytics.

Environment Configuration
Create a .env file in the backend directory to manage your Supabase and API credentials:

Bash

# Database (Supabase PostgreSQL)

DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your_secure_supabase_password
DB_HOST=aws-0-ap-south-1.pooler.supabase.com
DB_PORT=5432

# Third-Party Services

EXCHANGE_RATE_API_KEY=your_api_key_here

Local Setup Instructions

1. Backend (Django)
   Bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt

2. Database Migrations
   Run these to sync your local project with the Supabase PostgreSQL instance:

Bash
python manage.py makemigrations
python manage.py migrate

3. Frontend (Next.js)
   Bash
   cd frontend
   npm install
   npm install @tailwindcss/postcss # Fix for modern Tailwind processing

# Running Locally

Start both servers in separate terminal windows to enable full-stack communication.

Terminal 1: Backend

Bash
cd backend && source venv/bin/activate
python manage.py runserver

Terminal 2: Frontend

Bash
cd frontend
npm run dev

The application will launch at http://localhost:3000.

# How to Test

1. UI Flow to Test CRUD
   Create: Fill out the "Quick Add Transaction" form at the top of the page. Enter a description and amount, then click the centered Confirm Entry button.

Read: Verify that the entry appears instantly in the Recent History card on the right.

Update: Click the Edit icon (pencil) on a history card to reload its data into the form for modification.

Delete: Click the Trash icon to remove the entry from the database and UI.

2. Report/Visualization Page Path
   Path: / (Main Dashboard)

Feature: The Analytics card on the left side of the bottom grid provides a live breakdown of spending by category using a Doughnut chart.

3. Third-Party API Feature Path
   Path: Top-right Currency Dropdown.

Feature: Switching between USD, INR, and EUR triggers a live fetch to the ExchangeRate-API, recalculating the total spent and individual values on the fly.

# Deployment Notes

Frontend: Deployed via Vercel with full Turbopack and ESM configuration support.

Backend: Hosted on Render or Railway using a production Gunicorn server.

Database: Persisted on Supabase in the ap-south-1 (Mumbai) region for low-latency performance.
