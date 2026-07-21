import React, { useState, useEffect } from 'react'
import styles from './ProfileStats.module.css'
import { apiGetOrdersHistory, apiGetWishlist } from '../../api'

const IconPackage = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
)

const IconHeart = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
)

const IconStar = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
)

const IconTruck = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
)

export function ProfileStats() {
  const [ordersCount, setOrdersCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)
  const [activeShipments, setActiveShipments] = useState(0)

  useEffect(() => {
    let isMounted = true
    apiGetOrdersHistory()
      .then((orders) => {
        if (!isMounted) return
        setOrdersCount(orders.length)
        const active = orders.filter(
          (o) => o.status === 'SHIPPED' || o.status === 'PROCESSING'
        ).length
        setActiveShipments(active)
      })
      .catch(() => {})

    apiGetWishlist()
      .then((items) => {
        if (isMounted) setWishlistCount(items.length)
      })
      .catch(() => {})

    return () => {
      isMounted = false
    }
  }, [])

  const rewardPoints = (ordersCount * 150).toLocaleString()

  const stats = [
    { label: 'Total Orders', value: String(ordersCount).padStart(2, '0'), icon: <IconPackage /> },
    { label: 'Wishlist Items', value: String(wishlistCount).padStart(2, '0'), icon: <IconHeart /> },
    { label: 'Reward Points', value: rewardPoints, icon: <IconStar /> },
    { label: 'Active Shipments', value: String(activeShipments).padStart(2, '0'), icon: <IconTruck /> },
  ]

  return (
    <div className={styles.statsGrid}>
      {stats.map((stat, i) => (
        <div key={i} className={styles.statCard}>
          <div className={styles.iconWrap}>{stat.icon}</div>
          <span className={styles.statLabel}>{stat.label}</span>
          <span className={styles.statValue}>{stat.value}</span>
        </div>
      ))}
    </div>
  )
}

