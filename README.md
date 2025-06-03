# Bartering Platform - Frontend

A modern Angular 18 frontend application for a bartering platform where users can trade items without monetary exchange.

## Features

- 🔐 User authentication (register/login)
- 📱 Responsive Material Design UI
- 🔍 Browse and search items
- 📦 Manage personal items
- 🤝 Send and manage barter requests
- 💬 Simple messaging system
- ⚡ Real-time updates with Angular signals

## Technology Stack

- **Angular 18** - Modern web framework
- **Angular Material** - UI component library
- **TypeScript** - Type-safe JavaScript
- **RxJS** - Reactive programming
- **Angular Signals** - Reactive state management

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Angular CLI

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd bartering-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment:
   - Copy `src/environments/environment.ts.example` to `src/environments/environment.ts`
   - Update the API URL to point to your backend server

## Development

Start the development server:
```bash
ng serve
```

The application will be available at `http://localhost:4200/`

## Building

Build for production:
```bash
ng build --configuration production
```

The build artifacts will be stored in the `dist/` directory.

## Project Structure

```
src/
├── app/
│   ├── auth/           # Authentication components and services
│   ├── dashboard/      # Main dashboard component
│   ├── items/          # Items management service
│   ├── barter/         # Barter requests service
│   └── ...
├── environments/       # Environment configurations
└── ...
```

## Key Components

### Dashboard
The main component with three tabs:
- **Browse Items**: View and search all available items
- **My Items**: Manage your personal items
- **Barter Requests**: Handle incoming and outgoing barter requests

### Services
- `AuthService`: Handle user authentication
- `ItemsService`: Manage items CRUD operations
- `BarterService`: Handle barter requests

## API Integration

The frontend communicates with the NestJS backend through RESTful APIs:
- Authentication endpoints
- Items management
- Barter requests
- User profiles

## Development Notes

- Uses Angular standalone components
- Implements reactive patterns with Angular signals
- Material Design for consistent UI/UX
- Responsive design for mobile and desktop

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
