import React, { useState } from 'react'
import styles from './ProfilePage.module.css'
import { Navbar, Footer } from '../components/Layout'
import { ProfileSidebar } from '../components/profile/ProfileSidebar'
import { ProfileStats } from '../components/profile/ProfileStats'
import { RecentOrdersTable } from '../components/profile/RecentOrdersTable'
import { RecommendedSection } from '../components/profile/RecommendedSection'

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('profile')

  return (
    <div className={styles.root}>
      <Navbar activeLink="Shop" cartCount={3} />

      <main className={styles.main}>
        <div className={styles.layout}>
          {/* Sidebar Left */}
          <div className={styles.sidebarArea}>
            <ProfileSidebar activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          {/* Right Main Content */}
          <div className={styles.contentArea}>
            {/* Top Stat Cards */}
            <ProfileStats />

            {/* Recent Orders Table */}
            <RecentOrdersTable />

            {/* Recommended Products Promo Grid */}
            <RecommendedSection />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
