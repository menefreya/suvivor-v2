# Survivor Fantasy League App - Product Requirements Document

## 1. Executive Summary

### 1.1 Product Vision
The Survivor Fantasy League App is a web-based fantasy sports platform where users can create fantasy teams by drafting contestants from the TV show Survivor, predict weekly outcomes, and compete against other players for points throughout the season.

### 1.2 Target Audience
- Survivor TV show fans
- Fantasy sports enthusiasts
- Social gaming participants aged 18-55

### 1.3 Success Metrics
- User engagement: Daily/weekly active users
- Retention: Season completion rate
- Social interaction: League participation rate
- User satisfaction: App store ratings and user feedback

## 2. Product Overview

### 2.1 Core Value Proposition
Users can engage more deeply with Survivor by creating fantasy teams, predicting outcomes, and competing with friends in a structured point-based system that rewards knowledge of the game and strategic thinking.

### 2.2 Key Features
- Unique username creation and user management
- Contestant drafting system with editable picks
- Multi-tiered scoring system (Survivor Points, Vote Points, Bonus Points)
- Real-time leaderboards and rankings
- Weekly prediction challenges
- Season-long winner predictions

## 3. Functional Requirements

### 3.1 User Management
- **User Registration**: Users can create accounts with unique usernames
- **Username Validation**: System enforces unique usernames across the platform
- **User Profiles**: Basic profile management and viewing

### 3.2 Draft System
- **Initial Draft**: Users can select contestants for their fantasy team
- **Draft Editing**: Users can modify their picks at any point during the season
- **Draft Validation**: System prevents invalid selections (e.g., eliminated contestants)

### 3.3 Scoring System

#### 3.3.1 Survivor Points (1-2 points each)
- **Reward Challenge Win** (1 pt): Contestant wins reward challenge
- **Immunity Challenge Win** (2 pts): Contestant wins immunity challenge  
- **Island Challenge Participation** (1 pt): Contestant participates in island challenge
- **Tree Mail Reading** (1 pt): Contestant reads tree mail
- **Fire Making** (1 pt): Contestant makes or assists in making fire
- **Clue Finding** (1 pt): Contestant finds clue to hidden immunity idol/advantage
- **Merge Achievement** (1 pt): Contestant reaches the merge
- **Idol Discovery** (1 pt): Contestant finds hidden immunity idol
- **Idol Protection** (1 pt): Contestant becomes immune due to idol play
- **Advantage Gain** (1 pt): Contestant gains an advantage

#### 3.3.2 Vote Points (0-10 points)
- **Weekly Elimination Prediction**: Points awarded proportional to confidence allocation
- **Elimination Criteria**: Voted out, black rock draw, or fire challenge loss

#### 3.3.3 Bonus Points (0-13 points each)
- **Season Winner Prediction**: Points based on consecutive episodes with correct pick ending with finale
- **Elimination Streak**: Points for each episode a contestant remains eliminated

### 3.4 Game Management
- **Weekly Updates**: System updates with episode results
- **Leaderboard**: Real-time ranking of all players
- **Tie-breaking**: Automated tie-breaking using Vote > Survivor > Bonus point hierarchy

## 4. Technical Requirements

### 4.1 Frontend
- React.js web application
- Responsive design for mobile and desktop
- Real-time updates for scoring and leaderboards

### 4.2 Data Management
- Local state management with React hooks
- Mock data for contestant information
- Persistent storage for user data and picks

### 4.3 Core Components
- Authentication system
- Draft interface
- Scoring engine
- Leaderboard display
- Prediction interface

## 5. User Experience Requirements

### 5.1 User Flow
1. User creates account with unique username
2. User drafts initial team of contestants
3. User makes weekly elimination predictions
4. User selects season winner prediction
5. User views updated scores and leaderboard after episodes
6. User can edit picks throughout season

### 5.2 Interface Requirements
- Intuitive contestant selection interface
- Clear scoring breakdown and explanation
- Easy-to-read leaderboard with filtering options
- Mobile-responsive design

## 6. Data Structure

### 6.1 User Data
- Username (unique)
- Draft picks (array of contestant IDs)
- Vote predictions (weekly allocations)
- Winner prediction (contestant ID with episode tracking)
- Total scores (breakdown by category)

### 6.2 Contestant Data
- Name and photo
- Tribe affiliation
- Status (active/eliminated)
- Episode eliminated
- Performance stats

### 6.3 Scoring Events
- Episode number
- Event type
- Contestants affected
- Points awarded

## 7. Game Rules Implementation

### 7.1 Scoring Rules
- All scoring rules from the provided specification must be implemented
- Automatic point calculation after each episode
- Historical scoring tracking

### 7.2 Rule Changes
- System must accommodate mid-season rule changes
- Users notified of any scoring modifications

### 7.3 Season Management
- Support for multiple seasons
- Season-specific contestant data
- Cross-season user statistics

## 8. Success Criteria

### 8.1 MVP Requirements
- User registration with unique usernames ✓
- Contestant drafting with editing capability ✓
- Basic scoring system implementation ✓
- Simple leaderboard display ✓
- Weekly prediction system ✓

### 8.2 Future Enhancements
- Multi-league support
- Advanced statistics and analytics
- Social features (comments, messaging)
- Mobile app development
- Integration with Survivor episode data feeds

## 9. Risk Assessment

### 9.1 Technical Risks
- Data consistency in real-time updates
- Scalability for multiple concurrent users
- Complex scoring rule implementation

### 9.2 Business Risks
- Dependency on TV show continuation
- Copyright and licensing considerations
- User engagement sustainability

## 10. Timeline and Milestones

### Phase 1: Core MVP (Week 1-2)
- User authentication
- Basic drafting system
- Scoring engine foundation

### Phase 2: Full Scoring (Week 3-4)
- Complete scoring system implementation
- Leaderboard and rankings
- Weekly prediction system

### Phase 3: Polish and Testing (Week 5-6)
- UI/UX improvements
- Bug fixes and optimization
- User testing and feedback integration

This PRD serves as the foundational document for developing the Survivor Fantasy League App, ensuring all stakeholders understand the product requirements and success criteria.