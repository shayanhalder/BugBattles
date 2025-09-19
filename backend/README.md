# BugBattles Backend

A TypeScript Node.js backend API for the BugBattles application.

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm

### Installation

1. Install dependencies:
```bash
npm install
```

### Development

1. Start the development server with hot reload:
```bash
npm run dev
```

2. Build the project:
```bash
npm run build
```

3. Start the production server:
```bash
npm start
```

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server
- `npm run watch` - Watch for changes and recompile
- `npm run clean` - Remove compiled files

### Project Structure

```
backend/
├── src/
│   └── index.ts          # Main application entry point
├── dist/                 # Compiled JavaScript output
├── package.json          # Project dependencies and scripts
└── tsconfig.json         # TypeScript configuration
```

### API Endpoints

- `GET /` - Welcome message
- `GET /health` - Health check endpoint

### Environment Variables

- `PORT` - Server port (default: 3000)
