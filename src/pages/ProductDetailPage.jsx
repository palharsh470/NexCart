import React, { useState } from 'react'
import styles from './ProductDetailPage.module.css'
import { Navbar, Footer } from '../components/Layout'
import { Breadcrumbs } from '../components/common/Breadcrumbs'
import { StarRating } from '../components/common/StarRating'
import { QuantitySelector } from '../components/common/QuantitySelector'
import { ProductCard } from '../components/common/ProductCard'
import { IconSearchZoom, IconTruck, IconShield, IconCart } from '../components/Icons'

export default function ProductDetailPage() {
  const [selectedColor, setSelectedColor] = useState('midnight')
  const [selectedSize, setSelectedSize] = useState('standard')
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')

  const images = [
    '/assets/headphones_hero.png',
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=600&q=80',
  ]

  const [activeImg, setActiveImg] = useState(images[0])

  const relatedProducts = [
    {
      id: 6,
      name: 'SonicBuds Pro 2',
      brand: 'True Wireless Audio',
      price: 129.00,
      originalPrice: 159.00,
      image: '/assets/aura_buds.png',
    },
    {
      id: 2,
      name: 'NexaType Mechanical',
      brand: 'Peripherals',
      price: 189.00,
      image: '/assets/mechanical_keyboard.png',
    },
    {
      id: 3,
      name: 'EchoHome Hub',
      brand: 'Smart Living',
      price: 99.00,
      image: '/assets/omni_sound_speaker.png',
    },
    {
      id: 5,
      name: 'NexView 4K Ultra',
      brand: 'Monitors',
      price: 449.00,
      originalPrice: 529.00,
      image: '/assets/nexabook_laptop.png',
    },
  ]

  return (
    <div className={styles.root}>
      <Navbar activeLink="Shop" cartCount={3} />

      <main className={styles.main}>
        <Breadcrumbs
          items={[
            { label: 'Home', path: '/' },
            { label: 'Electronics', path: '/shop' },
            { label: 'Audio', path: '/shop' },
          ]}
        />

        {/* Top Product View */}
        <section className={styles.productTopSection}>
          <div className={styles.imagesArea}>
            <div className={styles.mainImageWrap}>
              <img src={activeImg} alt="Aura ANC Wireless Headphones" className={styles.mainImage} />
              <button className={styles.zoomBtn} aria-label="Zoom image">
                <IconSearchZoom />
              </button>
            </div>

            <div className={styles.thumbnails}>
              {images.map((img, i) => (
                <button
                  key={i}
                  className={`${styles.thumbBtn} ${activeImg === img ? styles.thumbBtnActive : ''}`}
                  onClick={() => setActiveImg(img)}
                >
                  <img src={img} alt={`Thumbnail ${i + 1}`} className={styles.thumbImg} />
                </button>
              ))}
            </div>
          </div>

          <div className={styles.detailsArea}>
            <span className={styles.bestSellerBadge}>BEST SELLER</span>
            <h1 className={styles.productTitle}>Aura ANC Wireless Headphones</h1>

            <div className={styles.ratingRow}>
              <StarRating rating={5} />
              <span className={styles.reviewsCount}>(124 Reviews)</span>
              <span className={styles.metaDivider}>|</span>
              <span className={styles.inStockStatus}>
                <span className={styles.greenDot} /> In Stock
              </span>
            </div>

            <div className={styles.priceRow}>
              <span className={styles.currentPrice}>$229.00</span>
              <span className={styles.originalPrice}>$299.00</span>
            </div>

            <p className={styles.productDesc}>
              Flagship hybrid noise cancellation, high-definition acoustics, and ultra-plush protein leather comfort for an immersive listening experience.
            </p>

            <div className={styles.selectorGroup}>
              <h3 className={styles.selectorTitle}>
                COLOR: <span className={styles.colorName}>{selectedColor === 'midnight' ? 'MIDNIGHT BLACK' : selectedColor === 'lightgray' ? 'LIGHT GRAY' : 'NAVY BLUE'}</span>
              </h3>
              <div className={styles.colorSwatches}>
                <button
                  className={`${styles.colorSwatch} ${selectedColor === 'midnight' ? styles.colorSwatchActive : ''}`}
                  style={{ backgroundColor: '#171d1b' }}
                  onClick={() => setSelectedColor('midnight')}
                  aria-label="Midnight Black"
                />
                <button
                  className={`${styles.colorSwatch} ${selectedColor === 'lightgray' ? styles.colorSwatchActive : ''}`}
                  style={{ backgroundColor: '#eaefec' }}
                  onClick={() => setSelectedColor('lightgray')}
                  aria-label="Light Gray"
                />
                <button
                  className={`${styles.colorSwatch} ${selectedColor === 'navy' ? styles.colorSwatchActive : ''}`}
                  style={{ backgroundColor: '#202f44' }}
                  onClick={() => setSelectedColor('navy')}
                  aria-label="Navy Blue"
                />
              </div>
            </div>

            <div className={styles.selectorGroup}>
              <div className={styles.sizeHeader}>
                <h3 className={styles.selectorTitle}>SIZE</h3>
                <a href="#" className={styles.sizeGuideLink}>Size Guide</a>
              </div>
              <div className={styles.sizeOptions}>
                <button
                  className={`${styles.sizeOptionBtn} ${selectedSize === 'standard' ? styles.sizeOptionBtnActive : ''}`}
                  onClick={() => setSelectedSize('standard')}
                >
                  Standard
                </button>
                <button
                  className={`${styles.sizeOptionBtn} ${selectedSize === 'xl' ? styles.sizeOptionBtnActive : ''}`}
                  onClick={() => setSelectedSize('xl')}
                >
                  Over-Ear XL
                </button>
              </div>
            </div>

            <div className={styles.actionRow}>
              <QuantitySelector
                quantity={quantity}
                onChange={setQuantity}
                size="large"
              />
              <button className={styles.btnAddToCart}>
                <IconCart /> Add to Cart
              </button>
            </div>

            <button className={styles.btnBuyNow}>Buy Now</button>

            <div className={styles.logisticsBar}>
              <div className={styles.logisticItem}>
                <IconTruck />
                <span className={styles.logisticText}>Free Shipping over $150</span>
              </div>
              <div className={styles.logisticItem}>
                <IconShield />
                <span className={styles.logisticText}>2 Year Brand Warranty</span>
              </div>
            </div>
          </div>
        </section>

        {/* Tabs Section */}
        <section className={styles.tabsSection}>
          <div className={styles.tabHeaders}>
            <button
              className={`${styles.tabHeaderBtn} ${activeTab === 'description' ? styles.tabHeaderBtnActive : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button
              className={`${styles.tabHeaderBtn} ${activeTab === 'specs' ? styles.tabHeaderBtnActive : ''}`}
              onClick={() => setActiveTab('specs')}
            >
              Specs
            </button>
            <button
              className={`${styles.tabHeaderBtn} ${activeTab === 'reviews' ? styles.tabHeaderBtnActive : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews (124)
            </button>
          </div>

          <div className={styles.tabContent}>
            {activeTab === 'description' && (
              <div className={styles.tabLayout}>
                <div className={styles.descriptionTextWrap}>
                  <h2 className={styles.tabSubTitle}>Professional Grade Sound</h2>
                  <p className={styles.tabParagraph}>
                    Experience the peak of audio engineering with the NexCart Aura ANC Wireless Headphones. Designed for audiophiles and professional commuters alike, these headphones utilize a hybrid active noise-cancellation system that blocks out 95% of ambient noise.
                  </p>
                  <p className={styles.tabParagraph}>
                    Whether you're in a busy cafe or on a long-haul flight, the Aura creates a sanctuary of sound. The custom-tuned 40mm drivers deliver crystalline highs, natural mid-tones, and a resonant, deep bass that never feels muddy.
                  </p>

                  <div className={styles.highlightsGrid}>
                    <div className={styles.highlightBox}>
                      <h4 className={styles.highlightTitle}>45H Battery</h4>
                      <p className={styles.highlightDesc}>Continuous playback with ANC on.</p>
                    </div>
                    <div className={styles.highlightBox}>
                      <h4 className={styles.highlightTitle}>Transparency</h4>
                      <p className={styles.highlightDesc}>Hear your world with one tap.</p>
                    </div>
                  </div>
                </div>

                <div className={styles.technicalHighlights}>
                  <h3 className={styles.techTableTitle}>Technical Highlights</h3>
                  <table className={styles.techTable}>
                    <tbody>
                      <tr>
                        <td className={styles.techKey}>Bluetooth</td>
                        <td className={styles.techVal}>v5.3 LE</td>
                      </tr>
                      <tr>
                        <td className={styles.techKey}>Frequency</td>
                        <td className={styles.techVal}>10Hz - 40kHz</td>
                      </tr>
                      <tr>
                        <td className={styles.techKey}>Microphones</td>
                        <td className={styles.techVal}>8-Mic Array</td>
                      </tr>
                      <tr>
                        <td className={styles.techKey}>Charge Port</td>
                        <td className={styles.techVal}>USB-C PD</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className={styles.tabSpecsList}>
                <h3 className={styles.techTableTitle}>Full Specifications</h3>
                <p className={styles.tabParagraph}>Detailed device parameters list will be shown here.</p>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className={styles.tabReviewsList}>
                <h3 className={styles.techTableTitle}>Customer Reviews</h3>
                <p className={styles.tabParagraph}>Customer review cards and rating highlights will load here.</p>
              </div>
            )}
          </div>
        </section>

        {/* Related Products */}
        <section className={styles.relatedSection}>
          <div className={styles.relatedHeader}>
            <div>
              <span className={styles.relatedSubTitle}>YOU MIGHT ALSO LIKE</span>
              <h2 className={styles.relatedTitle}>Related Products</h2>
            </div>
            <div className={styles.arrowControls}>
              <button className={styles.arrowBtn} aria-label="Previous related products">
                <span className={styles.arrowLeft}>←</span>
              </button>
              <button className={styles.arrowBtn} aria-label="Next related products">
                <span className={styles.arrowRight}>→</span>
              </button>
            </div>
          </div>

          <div className={styles.relatedGrid}>
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
