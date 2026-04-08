# Smart Encrypted File System (SEFS)

SEFS is a full-stack web application designed to automatically classify, encrypt, and manage sensitive files securely.

## Features
- **Upload files**: Fast and secure file uploading.
- **Auto-classification**: Automatically categorizes files as `HIGH` (sensitive) or `LOW` (general).
- **Secure Encryption**: Uses Fernet for encrypting high-sensitivity files in the background.
- **Analytics Dashboard**: Real-time statistics on encryption metrics and total uploads.
- **Modern UI**: Clean and modern Tailwind/shadcn UI interfaces.

## Technology Stack
- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion, shadcn/ui.
- **Backend**: FastAPI, SQLALchemy, PostgreSQL, Fernet Encryption, BackgroundTasks.
- **Infrastructure**: Docker & Docker Compose.

## How to Run

1. Make sure you have Docker and Docker Compose installed.
2. In the root directory, run:
   ```bash
   docker-compose up --build
   ```
3. Access the applications:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)
