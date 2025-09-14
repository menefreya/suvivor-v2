# Survivor Fantasy League App

A modern React/TypeScript application for managing Survivor fantasy leagues with a comprehensive draft system, user authentication, and real-time updates.

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure login/registration with Supabase Auth
- **Draft System**: Interactive drag-and-drop ranking interface
- **Contestant Management**: Full contestant profiles with tribe information
- **Season Management**: Multi-season support with deadline handling
- **Real-time Updates**: Auto-save functionality for draft rankings

### Draft System
- **Drag & Drop Interface**: Intuitive ranking system with visual feedback
- **Edit Mode**: Toggle between view and edit modes
- **Auto-save**: Automatic saving of changes with visual indicators
- **Deadline Management**: Proper deadline enforcement using `draft_deadline`
- **Tribe Integration**: Dynamic tribe colors and names

### User Experience
- **Responsive Design**: Mobile-first approach with modern UI
- **Visual Feedback**: Loading states, hover effects, and animations
- **Error Handling**: Comprehensive error messages and validation
- **Accessibility**: ARIA attributes and semantic HTML

## 🛠️ Tech Stack

### Frontend
- **React 18+** with functional components and hooks
- **TypeScript** for type safety and better developer experience
- **React Router** for client-side routing
- **React DnD** for drag-and-drop functionality
- **CSS Modules** for component-scoped styling

### Backend
- **Supabase** for authentication and database
- **PostgreSQL** database with real-time subscriptions
- **Row Level Security (RLS)** for data protection

### Development Tools
- **ESLint** and **Prettier** for code quality
- **Jest** and **React Testing Library** for testing
- **TypeScript strict mode** enabled

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── Auth/            # Authentication components
│   ├── Draft/           # Draft system components
│   ├── Layout/          # Layout and navigation
│   └── Profile/         # User profile components
├── hooks/               # Custom React hooks
├── services/            # API services and business logic
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
└── __tests__/           # Test files
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/menefreya/suvivor-v2.git
   cd suvivor-v2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   REACT_APP_SUPABASE_URL=your_supabase_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up the database**
   - Create a new Supabase project
   - Run the SQL schema from `table_schema.md`
   - Set up Row Level Security policies

5. **Start the development server**
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`.

## 🗄️ Database Schema

The application uses the following main tables:

- **seasons**: Season information with deadlines
- **contestants**: Contestant profiles and tribe assignments
- **tribes**: Tribe information with colors
- **draft_rankings**: User draft rankings
- **draft_picks**: User draft picks
- **episodes**: Episode information and air dates

See `table_schema.md` for the complete database schema.

## 🎯 Key Features Explained

### Draft System
The draft system allows users to:
1. **Rank contestants** using drag-and-drop interface
2. **Edit rankings** until the draft deadline
3. **Auto-save changes** with visual feedback
4. **Submit final rankings** for the season

### Authentication
- **Supabase Auth** integration
- **Protected routes** for authenticated users
- **User profile management**
- **Session persistence**

### Responsive Design
- **Mobile-first** approach
- **Touch-friendly** drag and drop
- **Adaptive layouts** for different screen sizes
- **Modern UI** with smooth animations

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Run tests with coverage:
```bash
npm test -- --coverage
```

## 📦 Building for Production

Create a production build:
```bash
npm run build
```

The build files will be in the `build/` directory.

## 🔧 Development Tools

### Database Utilities
The project includes console-based utilities for development:
- `setupTestSeason()`: Create test season data
- `extendDeadline()`: Extend draft deadline
- `checkDatabaseState()`: Check current database state

Access these through the browser console when running in development mode.

### Code Quality
- **ESLint** configuration for code quality
- **Prettier** for code formatting
- **TypeScript** strict mode for type safety
- **Pre-commit hooks** for quality checks

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with React and Supabase
- Drag and drop functionality powered by React DnD
- Modern UI design principles
- Survivor TV show for inspiration

## 📞 Support

For support, email support@example.com or create an issue in the repository.

---

**Happy Drafting! 🏝️**
