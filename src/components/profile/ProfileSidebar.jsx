import React from 'react'
import styles from './ProfileSidebar.module.css'

const IconUser = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
)

const IconBag = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
)

const IconHeart = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
)

const IconMapPin = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
)

const IconCreditCard = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
  </svg>
)

const IconLogout = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
)

export function ProfileSidebar({ activeTab = 'profile', onTabChange, user }) {
  const displayName = user?.profile?.full_name || user?.username || 'User'
  const avatarUrl = user?.profile?.avatar || null

  const navItems = [
    { id: 'profile', label: 'Profile', icon: <IconUser /> },
    { id: 'orders', label: 'Orders', icon: <IconBag /> },
    { id: 'wishlist', label: 'Wishlist', icon: <IconHeart /> },
  ]

  return (
    <aside className={styles.sidebarCard}>
      {/* User Header */}
      <div className={styles.userHeader}>
        {avatarUrl ? (
          <img src={avatarUrl} alt={displayName} className={styles.avatar} />
        ) : (
          <div className={styles.avatarFallback}>
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}
        <div className={styles.userInfo}>
          <h2 className={styles.userName}>{displayName}</h2>
          <span className={styles.userRole}>{user?.email || 'Member'}</span>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className={styles.navMenu}>
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`${styles.navItem} ${activeTab === item.id ? styles.navItemActive : ''}`}
            onClick={() => onTabChange && onTabChange(item.id)}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}

        <div className={styles.divider} />

        <button
          type="button"
          className={`${styles.navItem} ${styles.logoutItem}`}
          onClick={() => onTabChange && onTabChange('logout')}
        >
          <IconLogout />
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  )
}
