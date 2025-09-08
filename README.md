# Survivor Fantasy League

A React-based fantasy league application for Survivor Season 49. Draft contestants, make predictions, and compete with friends!

## Features

- **User Authentication**: Login/Register with email and password
- **Dashboard**: View your team, points, and recent activity
- **Contestant Management**: Track all Season 49 contestants
- **Scoring System**: Points for immunity wins, idol finds, eliminations, etc.
- **Admin Interface**: Manage episodes and scoring (for admins)

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd survivor-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Demo Accounts

For testing purposes, you can use these demo accounts:

- **Admin Account**: 
  - Email: `admin@survivor.com`
  - Password: `admin123`

- **Player Account**: 
  - Email: `player@survivor.com`
  - Password: `player123`

## Project Structure

```
src/
├── components/
│   ├── Auth/
│   │   └── Login.js          # Login/Register component
│   ├── Dashboard/
│   │   └── Dashboard.js      # Main dashboard
│   └── AppRoutes.js          # Route configuration
├── contexts/
│   └── AuthContext.js        # Authentication state management
├── App.js                    # Main app component
├── index.js                  # App entry point
└── index.css                 # Global styles with Tailwind
```

## Technology Stack

- **React 18** - Frontend framework
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Context API** - State management

## Features Overview

### Authentication
- Email/password login and registration
- Session persistence with localStorage
- Protected routes
- Demo accounts for testing

### Dashboard
- Current rank and points display
- Team overview with contestant information
- Recent activity feed
- Quick action buttons

### Contestant Data
The app includes all 18 contestants from Survivor Season 49:
- Alex Moore, Jake Latimer, Jason Treul, Jawan Pitts
- Jeremiah Ing, Kimberly "Annie" Davis, Kristina Mills, Matt Williams
- Michelle "MC" Chukwujekwu, Nate Moore, Nicole Mazullo, Rizo Velovic
- Sage Ahrens-Nichols, Savannah Louie, Shannon Fairweather
- Sophi Balerdi, Sophie Segreti, Steven Ramm

## Future Enhancements

Based on the PRD, upcoming features will include:
- Draft system with contestant ranking
- Weekly predictions and scoring
- Leaderboard and standings
- Admin scoring interface
- Episode management
- Contestant profile pages

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
