import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styles from './RecommendedSection.module.css'
import { apiGetFeaturedProducts } from '../../api'

export function RecommendedSection() {
  const [recommendations, setRecommendations] = useState([
    {
      badge: 'NEW ARRIVAL',
      badgeClass: styles.badgeNew,
      title: 'Aura Studio ANC',
      desc: 'Hybrid active noise cancellation with 40h battery life.',
      image: '/assets/headphones_hero.png',
      link: '/product/1',
    },
    {
      badge: 'SMART HOME',
      badgeClass: styles.badgeSmart,
      title: 'Lumina Core Hub',
      desc: 'The ultimate control center for your modern ecosystem.',
      image: '/assets/nexwatch_watch.png',
      link: '/product/3',
    },
  ])

  useEffect(() => {
    let isMounted = true
    apiGetFeaturedProducts()
      .then((products) => {
        if (!isMounted || !products || products.length === 0) return
        setRecommendations(
          products.slice(0, 2).map((p, index) => ({
            badge: index === 0 ? 'NEW ARRIVAL' : 'FEATURED',
            badgeClass: index === 0 ? styles.badgeNew : styles.badgeSmart,
            title: p.name,
            desc: p.description || 'Premium engineering for an immersive experience.',
            image: p.image,
            link: `/product/${p.id}`,
          }))
        )
      })
      .catch(() => {})

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Recommended for You</h2>

      <div className={styles.cardsGrid}>
        {recommendations.map((item, index) => (
          <div key={index} className={styles.promoCard}>
            <div className={styles.imgWrap}>
              <img src={item.image} alt={item.title} className={styles.cardImg} />
            </div>
            <div className={styles.cardContent}>
              <span className={`${styles.badge} ${item.badgeClass}`}>{item.badge}</span>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardDesc}>{item.desc}</p>
              <Link to={item.link} className={styles.shopLink}>
                Shop Now →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

