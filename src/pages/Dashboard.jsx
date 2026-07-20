import React from 'react'
import { Link } from 'react-router-dom'
import styles from './Dashboard.module.css'
import { Navbar, Footer } from '../components/Layout'
import { HeroBanner } from '../components/dashboard/HeroBanner'
import { TrustBar } from '../components/dashboard/TrustBar'

/* ── Category Icons ────────────────────────── */
const IconMonitor = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00685c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
  </svg>
)
const IconShirt = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00685c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l1.5 10a2 2 0 0 0 2 1.71h13.44a2 2 0 0 0 2-1.71l1.5-10a2 2 0 0 0-1.34-2.23z"/>
    <path d="M12 2v6"/>
  </svg>
)
const IconWatch = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00685c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="7"/><polyline points="12 9 12 12 13.5 13.5"/>
    <path d="M16.51 7.49L18 2H6l1.49 5.49M16.51 16.51L18 22H6l1.49-5.49"/>
  </svg>
)
const IconHouse = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00685c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
)

export default function Dashboard() {
  return (
    <div className={styles.root}>
      <Navbar activeLink="Shop" cartCount={3} />

      <main className={styles.main}>
        {/* Hero Section */}
        <HeroBanner />

        {/* Explore Featured Categories */}
        <section className={styles.section}>
          <span className={styles.sectionSub}>HANDPICKED COLLECTIONS</span>
          <h2 className={styles.sectionTitle}>Explore Featured Categories</h2>

          <div className={styles.categoriesGrid}>
            <Link to="/shop" className={styles.categoryCard}>
              <div className={styles.categoryIconWrap}>
                <IconMonitor />
              </div>
              <h3 className={styles.categoryName}>Electronics</h3>
              <p className={styles.categoryCount}>184+ Products</p>
            </Link>

            <Link to="/shop" className={styles.categoryCard}>
              <div className={styles.categoryIconWrap}>
                <IconShirt />
              </div>
              <h3 className={styles.categoryName}>Apparel &amp; Shoes</h3>
              <p className={styles.categoryCount}>320+ Products</p>
            </Link>

            <Link to="/shop" className={styles.categoryCard}>
              <div className={styles.categoryIconWrap}>
                <IconWatch />
              </div>
              <h3 className={styles.categoryName}>Accessories</h3>
              <p className={styles.categoryCount}>145+ Products</p>
            </Link>

            <Link to="/shop" className={styles.categoryCard}>
              <div className={styles.categoryIconWrap}>
                <IconHouse />
              </div>
              <h3 className={styles.categoryName}>Home &amp; Living</h3>
              <p className={styles.categoryCount}>212+ Products</p>
            </Link>
          </div>
        </section>

        {/* Trust Bar */}
        <TrustBar />

        {/* Trending Releases */}
        <section className={styles.section}>
          <div className={styles.trendingHeader}>
            <div>
              <span className={styles.sectionSub}>WHAT'S HOT NOW</span>
              <h2 className={styles.sectionTitle}>Trending Releases</h2>
            </div>
            <Link to="/shop" className={styles.catalogLink}>
              View All Shop Catalog <span className={styles.arrowLink}>→</span>
            </Link>
          </div>

          <div className={styles.trendingGrid}>
            <div className={styles.trendingBigCard}>
              <img
                src="/assets/nexabook_laptop.png"
                alt="NexaBook Pro M3 laptop"
                className={styles.bigCardImg}
              />
              <div className={styles.bigCardOverlay}>
                <span className={styles.newArrivalBadge}>NEW ARRIVAL</span>
                <h3 className={styles.bigCardTitle}>NexaBook Pro M3</h3>
                <p className={styles.bigCardDesc}>The future of performance and portability.</p>
                <span className={styles.bigCardPrice}>$1,499.00</span>
              </div>
            </div>

            <div className={styles.trendingRightGroup}>
              <div className={styles.budsCard}>
                <div className={styles.budsContent}>
                  <h3 className={styles.budsTitle}>Aura Buds 2</h3>
                  <p className={styles.budsDesc}>Pure silence, pure sound.</p>
                  <span className={styles.budsPrice}>$179.00</span>
                </div>
                <div className={styles.budsImgWrap}>
                  <img
                    src="/assets/aura_buds.png"
                    alt="Aura Buds 2"
                    className={styles.budsImg}
                  />
                </div>
              </div>

              <div className={styles.smallCardsRow}>
                <div className={styles.smallCard}>
                  <div className={styles.smallCardImgWrap}>
                    <img
                      src="/assets/nexwatch_watch.png"
                      alt="NexWatch Elite"
                      className={styles.smallCardImg}
                    />
                  </div>
                  <div className={styles.smallCardContent}>
                    <h4 className={styles.smallCardTitle}>NexWatch Elite</h4>
                    <p className={styles.smallCardDesc}>Smart Living</p>
                    <span className={styles.smallCardPrice}>$249.00</span>
                  </div>
                </div>

                <div className={styles.smallCard}>
                  <div className={styles.smallCardImgWrap}>
                    <img
                      src="/assets/omni_sound_speaker.png"
                      alt="Omni Sound G1"
                      className={styles.smallCardImg}
                    />
                  </div>
                  <div className={styles.smallCardContent}>
                    <h4 className={styles.smallCardTitle}>Omni Sound G1</h4>
                    <p className={styles.smallCardDesc}>Home Audio</p>
                    <span className={styles.smallCardPrice}>$199.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
