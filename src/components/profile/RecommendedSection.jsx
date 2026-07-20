import React from 'react'
import { Link } from 'react-router-dom'
import styles from './RecommendedSection.module.css'

export function RecommendedSection() {
  const recommendations = [
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
      image: 'https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=600&q=80',
      link: '/shop',
    },
  ]

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
