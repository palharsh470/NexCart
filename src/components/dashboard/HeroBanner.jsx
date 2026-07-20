import React from 'react'
import { Link } from 'react-router-dom'
import styles from './HeroBanner.module.css'

export function HeroBanner() {
  return (
    <section className={styles.heroSection}>
      <div className={styles.heroContainer}>
        <div className={styles.heroLeft}>
          <span className={styles.bestSellerBadge}>
            <span className={styles.stars}>✨</span> BEST SELLER
          </span>
          <h1 className={styles.heroTitle}>Premium Tech.<br />Redefined.</h1>
          <p className={styles.heroDesc}>
            Experience precision engineering with our signature hybrid noise cancellation and ultra-plush protein leather comfort.
          </p>
          <div className={styles.heroCtaGroup}>
            <Link to="/shop" className={styles.btnShopNow}>
              Shop Now <span className={styles.arrow}>→</span>
            </Link>
            <div className={styles.heroPriceWrap}>
              <span className={styles.startingAt}>STARTING AT</span>
              <span className={styles.heroPrice}>$229</span>
            </div>
          </div>
          <div className={styles.heroSliderDots}>
            <span className={`${styles.sliderDot} ${styles.sliderDotActive}`} />
            <span className={styles.sliderDot} />
          </div>
        </div>
        <div className={styles.heroRight}>
          <div className={styles.yellowCard}>
            <img
              src="/assets/headphones_hero.png"
              alt="Premium noise cancelling headphones"
              className={styles.heroImage}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
