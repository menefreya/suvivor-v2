import React from 'react'
import './Navigation.css'

interface NavigationProps {
  currentPage: string
  onPageChange: (page: string) => void
  user: any
}

export const Navigation: React.FC<NavigationProps> = ({ 
  currentPage, 
  onPageChange, 
  user 
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'drafts', label: 'Draft', icon: '📋' },
    { id: 'team', label: 'My Team', icon: '👥' },
    { id: 'leaderboard', label: 'Leaderboard', icon: '🏆' },
    { id: 'predictions', label: 'Predictions', icon: '🔮' }
  ]

  return (
    <nav className="main-navigation">
      <ul className="nav-list">
        {navItems.map(item => (
          <li key={item.id} className="nav-item">
            <button
              className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => onPageChange(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
