import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styles from './Dashboard.module.css'
import { Navbar, Footer } from '../components/Layout'
import { HeroBanner } from '../components/dashboard/HeroBanner'
import { TrustBar } from '../components/dashboard/TrustBar'
import { apiGetFeaturedProducts } from '../api'

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
  const [featured, setFeatured] = useState([])

  useEffect(() => {
    let isMounted = true
    apiGetFeaturedProducts()
      .then((data) => {
        if (isMounted && data && data.length > 0) {
          setFeatured(data)
        }
      })
      .catch((err) => {
        console.log('Using default hero products:', err)
      })
    return () => {
      isMounted = false
    }
  }, [])

  const bigProduct = featured[0] || {
    id: 1,
    name: 'Featured Product',
    price: 499.0,
    category: 'NEW ARRIVAL',
    description: 'Modern performance and elegant design.',
    image: '/assets/product_placeholder.svg',
  }

  const budsProduct = featured[1] || {
    id: 2,
    name: 'Featured Accessory',
    price: 179.0,
    description: 'Pure clarity and comfort.',
    image: '/assets/product_placeholder.svg',
  }

  const small1 = featured[2] || {
    id: 3,
    name: 'Smart Device',
    category: 'Smart Living',
    price: 249.0,
    image: '/assets/product_placeholder.svg',
  }

  const small2 = featured[3] || {
    id: 4,
    name: 'Audio Gear',
    category: 'Home Audio',
    price: 199.0,
    image: '/assets/product_placeholder.svg',
  }

  return (
    <div className={styles.root}>
      <Navbar activeLink="Categories" />

      <main className={styles.main}>
        {}
        <HeroBanner />

        {}
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

        {}
        <TrustBar />

        {}
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
            <Link to={`/product/${bigProduct.id}`} className={styles.trendingBigCard} style={{ textDecoration: 'none' }}>
              <img
                src={bigProduct.image}
                alt={bigProduct.name}
                className={styles.bigCardImg}
              />
              <div className={styles.bigCardOverlay}>
                <span className={styles.newArrivalBadge}>{bigProduct.category || 'NEW ARRIVAL'}</span>
                <h3 className={styles.bigCardTitle}>{bigProduct.name}</h3>
                <p className={styles.bigCardDesc}>{bigProduct.description || 'The future of performance and portability.'}</p>
                <span className={styles.bigCardPrice}>${bigProduct.price.toFixed(2)}</span>
              </div>
            </Link>

            <div className={styles.trendingRightGroup}>
              <Link to={`/product/${budsProduct.id}`} className={styles.budsCard} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className={styles.budsContent}>
                  <h3 className={styles.budsTitle}>{budsProduct.name}</h3>
                  <p className={styles.budsDesc}>{budsProduct.description || 'Pure silence, pure sound.'}</p>
                  <span className={styles.budsPrice}>${budsProduct.price.toFixed(2)}</span>
                </div>
                <div className={styles.budsImgWrap}>
                  <img
                    src={budsProduct.image}
                    alt={budsProduct.name}
                    className={styles.budsImg}
                  />
                </div>
              </Link>

              <div className={styles.smallCardsRow}>
                <Link to={`/product/${small1.id}`} className={styles.smallCard} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className={styles.smallCardImgWrap}>
                    <img
                      src={small1.image}
                      alt={small1.name}
                      className={styles.smallCardImg}
                    />
                  </div>
                  <div className={styles.smallCardContent}>
                    <h4 className={styles.smallCardTitle}>{small1.name}</h4>
                    <p className={styles.smallCardDesc}>{small1.category || 'Smart Living'}</p>
                    <span className={styles.smallCardPrice}>${small1.price.toFixed(2)}</span>
                  </div>
                </Link>

                <Link to={`/product/${small2.id}`} className={styles.smallCard} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className={styles.smallCardImgWrap}>
                    <img
                      src={small2.image}
                      alt={small2.name}
                      className={styles.smallCardImg}
                    />
                  </div>
                  <div className={styles.smallCardContent}>
                    <h4 className={styles.smallCardTitle}>{small2.name}</h4>
                    <p className={styles.smallCardDesc}>{small2.category || 'Home Audio'}</p>
                    <span className={styles.smallCardPrice}>${small2.price.toFixed(2)}</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

