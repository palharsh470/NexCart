import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './ProfilePage.module.css'
import { Navbar, Footer } from '../components/Layout'
import { ProfileSidebar } from '../components/profile/ProfileSidebar'
import { ProfileStats } from '../components/profile/ProfileStats'
import { RecentOrdersTable } from '../components/profile/RecentOrdersTable'
import { RecommendedSection } from '../components/profile/RecommendedSection'
import { useAuth } from '../AuthContext'

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('profile')
  const { user, isAuthenticated, loading, logout } = useAuth()
  const navigate = useNavigate()

  
  React.useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/sign-in', { replace: true })
    }
  }, [loading, isAuthenticated, navigate])

  const handleTabChange = async (tab) => {
    if (tab === 'logout') {
      await logout()
      navigate('/', { replace: true })
      return
    }
    if (tab === 'wishlist') {
      navigate('/wishlist')
      return
    }
    if (tab === 'orders') {
      setActiveTab('orders')
      setTimeout(() => {
        const ordersElem = document.getElementById('recent-orders-section')
        if (ordersElem) {
          ordersElem.scrollIntoView({ behavior: 'smooth' })
        }
      }, 50)
      return
    }
    setActiveTab(tab)
  }

  
  if (loading) {
    return (
      <div className={styles.root}>
        <Navbar activeLink="Shop" />
        <main className={styles.main}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <p style={{ color: '#6d7a76', fontSize: '1rem' }}>Loading…</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!isAuthenticated) return null

  return (
    <div className={styles.root}>
      <Navbar activeLink="Shop" />

      <main className={styles.main}>
        <div className={styles.layout}>
          {}
          <div className={styles.sidebarArea}>
            <ProfileSidebar activeTab={activeTab} onTabChange={handleTabChange} user={user} />
          </div>

          {}
          <div className={styles.contentArea}>
            {}
            <ProfileStats />

            {}
            <RecentOrdersTable />

            {}
            <RecommendedSection />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

