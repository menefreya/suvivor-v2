# Survivor Fantasy League App - Product Requirements Document

## Executive Summary
A fantasy sports app for Survivor TV show fans to create leagues, draft contestants, and compete based on contestant performance throughout the season.

## Site Architecture

### Core User Flows
1. **Registration/Authentication** → **League Creation/Joining** → **Draft Setup** → **Weekly Gameplay** → **Scoring & Leaderboards**
2. **Admin Flow**: **Season Setup** → **Weekly Scoring** → **League Management**

### Database Entities
- Users (players, admins)
- Leagues 
- Seasons
- Contestants
- Draft Picks
- Weekly Predictions
- Scoring Events
- Leaderboards

## Page Structure & Features

### 1. Authentication Pages
**Login/Register**
- Email/password authentication
- Social login options
- Password reset functionality

### 2. Dashboard/Home
**Main Landing (Post-Login)**
- Current league standings
- This week's prediction deadline
- Recent scoring updates
- Navigation to all sections



### 4. Draft System
**Pre-Draft: Contestant Ranking**
- Available after Episode 2
- Drag-and-drop ranking interface
- Contestant profiles with photos/bios
- Submit ranking by deadline

**Draft Results**
- Show auto-assigned 2 contestants per player
- Display draft order logic
- Replacement system when contestants eliminated

### 5. Weekly Gameplay
**Predictions Dashboard**
- Current sole survivor pick (changeable)
- This week's elimination prediction
- Deadline countdown
- Submission confirmation

**My Team**
- Current active contestants
- Season-long sole survivor
- Performance history
- Next replacement in queue

### 6. Scoring & Results


**Detailed Scoring**
- Challenge winners
- Idol finds/plays
- Eliminations
- Bonus actions

### 7. Leaderboards
**League Standings**
- Current points total
- Weekly point changes
- Position changes
- Projected winners

**Historical Performance**
- Episode-by-episode breakdown
- Individual contestant performance
- Head-to-head comparisons


## Technical Requirements

### Core Functionality
**User Management**
- Registration/authentication
- Profile management
- League membership tracking

**Draft System**
- Stack ranking collection after Episode 2
- Automated assignment of 2 draft picks per player
- Each player's tribe = sole survivor + 2 draft picks
- Replacement logic when tribe members eliminated



**Scoring Engine**
- Point calculation based on rules
- Real-time leaderboard updates
- Historical tracking

### System Jobs
**Weekly Automated Tasks**
- Lock predictions at episode air time
- Process elimination replacements
- Update leaderboards post-scoring
- Send notification emails

**Season Management**
- Initialize new seasons
- Archive completed seasons
- Generate season statistics

## User Experience Requirements

### Responsive Design
- Mobile-first approach
- Tablet optimization
- Desktop enhancement

### Performance
- Fast page loads
- Real-time updates during scoring
- Efficient data caching

## Success Metrics
- User engagement (weekly prediction rate)
- League completion rate
- User retention season-over-season
- Time spent in app during episodes



## Development Phases

### Phase 1 (MVP)
- Basic authentication
- League creation/joining
- Draft system
- Weekly predictions
- Simple leaderboards

### Phase 2
- Enhanced UI/UX
- Automated notifications
- Detailed statistics
- Mobile optimization

### Phase 3
- Advanced features
- API integrations
- Analytics dashboard

## Scoring rules


Scoring Rules
Basic Scoring:
Immunity Challenge Win:  
+3 points for individual win
+2 for team win
Reward Challenge Win: 
+2 points  for individual win
+1 Team win
Finding Hidden Immunity Idol: +3 points
Playing Idol Successfully: +2 points (negates votes)


Penalties:
Eliminated: -5 points
Voted Out with Idol: -3 additional points
Bonus Points
Sole Survivor: +1 point per episode you had them as sole survivor
Bonus: picked your sole survivor ep 2 and 
they won: +25 points 
Make Final 3: +10 points - 
Make fire: +1 point
Read tree mail: +1 point
Play shot in the dark:  +1 point
Get immunity from shot in the dark: +4 points 
Eliminated person on your tribe: +1 point per eliminated player
Made interesting food: 1 pt

## Player rules 

Survivor fantasy league How to play 
Player Rules
At the end of episode 2 players stack rank all the contestants. This becomes input for the draft pick. 
The system will pick 2 players as the draft pick for the players. 
If the player gets eliminated the system will replace the draft with the next available contestant in the players draft pick 
Player picks sole survivor at the end of episode 2. Player can change their sole survivor pick at any point during the season. 

---

## Epics and User Stories

### Epic 1: User Authentication & Profile Management
**Goal**: Enable users to securely register, login, and manage their profiles

#### User Story 1.1: User Registration
**As a** new user  
**I want to** create an account  
**So that** I can participate in Survivor fantasy leagues

**Acceptance Criteria:**
- User can register with email and password
- Email validation is required
- Password must meet security requirements (8+ characters)
- User receives confirmation email after registration
- User is automatically logged in after successful registration
- Duplicate emails are not allowed

#### User Story 1.2: User Login
**As a** registered user  
**I want to** log into my account  
**So that** I can access my fantasy leagues and data

**Acceptance Criteria:**
- User can login with email and password
- Invalid credentials show appropriate error message
- "Remember me" option keeps user logged in
- Password reset option is available
- User is redirected to dashboard after successful login

#### User Story 1.3: Profile Management
**As a** logged-in user  
**I want to** manage my profile information  
**So that** I can keep my details current

**Acceptance Criteria:**
- User can view current profile information
- User can update email, name, and preferences
- Changes require password confirmation for security
- Profile changes are saved and reflected immediately
- User can change password with current password verification

### Epic 2: Draft System
**Goal**: Enable players to rank contestants and receive automated draft picks

#### User Story 2.1: Contestant Ranking Interface
**As a** league player  
**I want to** rank all contestants after Episode 2  
**So that** the system can assign my draft picks based on my preferences

**Acceptance Criteria:**
- Draft interface is available only after Episode 2 airs
- All active contestants are displayed with photos and basic info
- Drag-and-drop interface allows easy reordering
- Rankings are auto-saved as user makes changes
- User can submit final rankings before deadline
- Deadline countdown is prominently displayed
- User cannot modify rankings after deadline

#### User Story 2.2: Automated Draft Pick Assignment
**As a** league player  
**I want to** receive 2 contestants automatically assigned based on my rankings  
**So that** I have my initial team without manual draft coordination

**Acceptance Criteria:**
- System assigns exactly 2 contestants per player after ranking deadline
- Assignment algorithm ensures fair distribution across all players
- No contestant is assigned to multiple players
- Players are notified of their draft picks via email and in-app
- Draft results are visible in user's "My Team" section
- Draft logic is transparent and explainable to users

#### User Story 2.3: Contestant Replacement System
**As a** league player  
**I want to** automatically receive replacement contestants when mine are eliminated  
**So that** I maintain a full team throughout the season

**Acceptance Criteria:**
- When a player's contestant is eliminated, system automatically assigns next available from their rankings
- Replacement happens immediately after episode scoring
- Player is notified of replacement via notification
- Replacement history is tracked and visible
- No manual intervention required from player
- System handles edge cases (no more contestants available)

### Epic 3: Sole Survivor Selection
**Goal**: Allow players to select and modify their sole survivor pick

#### User Story 3.1: Initial Sole Survivor Selection
**As a** league player  
**I want to** select my sole survivor pick after Episode 2  
**So that** I can earn bonus points if they win the season

**Acceptance Criteria:**
- Sole survivor selection is available after Episode 2
- All active contestants are selectable
- Selection deadline is clearly displayed
- Player must make selection before deadline
- Confirmation message is shown after selection
- Selection is reflected in "My Team" section

#### User Story 3.2: Sole Survivor Modification
**As a** league player  
**I want to** change my sole survivor pick during the season  
**So that** I can adapt my strategy as the game progresses

**Acceptance Criteria:**
- Player can change sole survivor pick at any time before finale
- Only active (non-eliminated) contestants are selectable
- Change history is tracked for transparency
- Points calculation reflects timing of pick changes
- Clear indication when pick cannot be changed (finale week)
- Confirmation required for changes

### Epic 4: Weekly Predictions
**Goal**: Enable players to make weekly elimination predictions

#### User Story 4.1: Weekly Elimination Prediction
**As a** league player  
**I want to** predict who will be eliminated each week  
**So that** I can earn additional points for correct predictions

**Acceptance Criteria:**
- Prediction interface is available each week before episode airs
- All active contestants are available for selection
- Deadline is clearly displayed with countdown
- Player can change prediction until deadline
- Prediction is locked after deadline
- Results and points are shown after episode scoring

### Epic 5: Scoring & Points System
**Goal**: Automatically calculate and display player scores based on game events

#### User Story 5.1: Real-time Score Calculation
**As a** league player  
**I want to** see my points updated automatically after each episode  
**So that** I can track my performance throughout the season

**Acceptance Criteria:**
- Points are calculated based on documented scoring rules
- Score updates happen immediately after admin enters episode results
- Point breakdown is visible (challenge wins, idol plays, etc.)
- Historical point changes are tracked per episode
- Total season points are prominently displayed
- Scoring is consistent and transparent

#### User Story 5.2: Detailed Scoring Breakdown
**As a** league player  
**I want to** see exactly how my points were calculated  
**So that** I can understand my performance and verify accuracy

**Acceptance Criteria:**
- Detailed breakdown shows points per contestant per episode
- Each scoring event is listed with point value
- Sole survivor bonus points are clearly indicated
- Penalty points (eliminations) are shown separately
- Historical view shows progression over time
- Export functionality for personal records

### Epic 6: Leaderboards & League Management
**Goal**: Display competitive standings and league information

#### User Story 6.1: League Leaderboard
**As a** league player  
**I want to** see current standings in my league  
**So that** I can track my competitive position

**Acceptance Criteria:**
- Leaderboard shows all players ranked by total points
- Current week's point changes are highlighted
- Position changes from previous week are indicated
- Tie-breaking rules are applied consistently
- Leaderboard updates in real-time after scoring
- Mobile-responsive display for all devices

#### User Story 6.2: Historical Performance Analysis
**As a** league player  
**I want to** view historical performance data  
**So that** I can analyze trends and improve my strategy

**Acceptance Criteria:**
- Episode-by-episode point progression chart
- Individual contestant performance within my team
- Head-to-head comparison with other players
- Season-long statistics and averages
- Exportable data for external analysis
- Filter and sort capabilities

### Epic 7: Team Management Dashboard
**Goal**: Provide comprehensive view of player's current team status

#### User Story 7.1: My Team Overview
**As a** league player  
**I want to** see my current active contestants and sole survivor  
**So that** I can track my team composition and performance

**Acceptance Criteria:**
- Current 2 draft picks are displayed with photos and stats
- Sole survivor pick is prominently featured
- Next replacement contestant is shown (from rankings)
- Individual contestant points are displayed
- Season-long performance for each team member
- Quick access to change sole survivor pick

#### User Story 7.2: Team Performance History
**As a** league player  
**I want to** see how my team performed in previous episodes  
**So that** I can understand my scoring patterns

**Acceptance Criteria:**
- Episode-by-episode team performance breakdown
- Contestant replacement history with dates
- Sole survivor pick change history
- Comparative performance vs league average
- Visual charts showing trends over time
- Individual contestant contribution analysis

### Epic 8: Admin Season Management
**Goal**: Enable administrators to manage seasons, contestants, and scoring

#### User Story 8.1: Season Setup and Management
**As an** administrator  
**I want to** set up new seasons and manage contestant data  
**So that** leagues can operate with current season information

**Acceptance Criteria:**
- Create new season with basic information (name, dates, etc.)
- Add/edit/remove contestants with photos and biographical info
- Set episode air dates and prediction deadlines
- Configure scoring rules per season
- Archive completed seasons
- Migrate player data between seasons

#### User Story 8.2: Weekly Episode Scoring
**As an** administrator  
**I want to** enter episode results and trigger score calculations  
**So that** player scores are updated accurately and timely

**Acceptance Criteria:**
- Interface to record all scoring events per episode
- Batch entry for efficiency during live scoring
- Preview score changes before final submission
- Automatic calculation triggers after data entry
- Audit trail of all scoring entries and changes
- Rollback capability for corrections

### Epic 9: Mobile Experience
**Goal**: Ensure full functionality on mobile devices

#### User Story 9.1: Mobile-Responsive Interface
**As a** mobile user  
**I want to** access all fantasy league features on my phone  
**So that** I can participate fully regardless of device

**Acceptance Criteria:**
- All pages render correctly on mobile devices
- Touch-friendly interface elements (buttons, drag-drop)
- Optimized loading times on mobile networks
- Offline capability for viewing existing data
- Push notifications for important deadlines
- Mobile-specific navigation patterns

### Epic 10: Notifications & Communication
**Goal**: Keep players informed of important deadlines and updates

#### User Story 10.1: Automated Notifications
**As a** league player  
**I want to** receive timely notifications about deadlines and updates  
**So that** I don't miss important fantasy league activities

**Acceptance Criteria:**
- Email notifications for ranking deadlines, score updates, eliminations
- In-app notifications for real-time updates
- Customizable notification preferences
- Reminder notifications 24 hours before deadlines
- Weekly summary emails with league standings
- Push notifications for mobile users

---

## Acceptance Criteria Standards

### Definition of Done for All User Stories:
- [ ] Feature works on mobile, tablet, and desktop
- [ ] All acceptance criteria are met and tested
- [ ] Code is reviewed and approved
- [ ] Feature is accessible (WCAG 2.1 AA compliance)
- [ ] Performance requirements are met (page loads < 3 seconds)
- [ ] Feature is secure and handles edge cases appropriately
- [ ] Documentation is updated
- [ ] User testing is completed with positive feedback

### Testing Requirements:
- Unit tests for all business logic
- Integration tests for API endpoints
- End-to-end tests for critical user flows
- Cross-browser compatibility testing
- Mobile device testing on iOS and Android
- Performance testing under expected load
- Security testing for authentication and data protection





