import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import styles from './ProductDetailPage.module.css'
import { Navbar, Footer } from '../components/Layout'
import { Breadcrumbs } from '../components/common/Breadcrumbs'
import { StarRating } from '../components/common/StarRating'
import { QuantitySelector } from '../components/common/QuantitySelector'
import { ProductCard } from '../components/common/ProductCard'
import { IconSearchZoom, IconTruck, IconShield, IconCart } from '../components/Icons'
import { apiGetProductDetail, apiGetRelatedProducts, apiGetFeaturedProducts, apiAddCartItem, apiGetCart } from '../api'
import { useAuth } from '../AuthContext'

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [selectedColor, setSelectedColor] = useState('standard')
  const [selectedSize, setSelectedSize] = useState('standard')
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const [activeImg, setActiveImg] = useState('')
  const [addingToCart, setAddingToCart] = useState(false)
  const [cartMsg, setCartMsg] = useState('')
  const [isInCart, setIsInCart] = useState(false)

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    setError(null)
    setIsInCart(false)

    // Fetch product details
    apiGetProductDetail(id)
      .then((data) => {
        if (isMounted) {
          setProduct(data)
          setActiveImg(data.image)
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error('Error fetching product detail:', err)
          setError('Could not load product details.')
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    apiGetCart()
      .then((cartItems) => {
        if (!isMounted || !Array.isArray(cartItems)) return
        const exists = cartItems.some(
          (item) => Number(item.productId) === Number(id) || Number(item.id) === Number(id)
        )
        if (exists) setIsInCart(true)
      })
      .catch(() => { })


    apiGetRelatedProducts(id)
      .then((relData) => {
        if (!isMounted) return
        if (relData && relData.length > 0) {
          setRelatedProducts(relData)
        } else {

          apiGetFeaturedProducts()
            .then((featData) => {
              if (isMounted) {
                setRelatedProducts(featData.filter((item) => item.id !== Number(id)))
              }
            })
            .catch(() => { })
        }
      })
      .catch(() => {
        if (!isMounted) return
        apiGetFeaturedProducts()
          .then((featData) => {
            if (isMounted) {
              setRelatedProducts(featData.filter((item) => item.id !== Number(id)))
            }
          })
          .catch(() => { })
      })

    return () => {
      isMounted = false
    }
  }, [id])

  const handleAddToCart = async () => {
    if (!product) return
    if (!isAuthenticated) {
      navigate('/sign-in')
      return
    }
    if (isInCart) {
      navigate('/cart')
      return
    }
    setAddingToCart(true)
    setCartMsg('')
    try {
      await apiAddCartItem(product.id, quantity)
      setIsInCart(true)
      setCartMsg('Added to cart successfully!')
      setTimeout(() => setCartMsg(''), 3000)
    } catch (err) {
      if (err.message.includes('sign in') || err.message === 'Unauthenticated') {
        navigate('/sign-in')
      } else {
        setCartMsg(err.message || 'Could not add item to cart.')
      }
    } finally {
      setAddingToCart(false)
    }
  }

  const handleBuyNow = async () => {
    if (!product) return
    if (!isAuthenticated) {
      navigate('/sign-in')
      return
    }
    setAddingToCart(true)
    try {
      await apiAddCartItem(product.id, quantity)
      navigate('/cart')
    } catch (err) {
      if (err.message.includes('sign in') || err.message === 'Unauthenticated') {
        navigate('/sign-in')
      } else {
        setCartMsg(err.message || 'Could not add item to cart.')
      }
    } finally {
      setAddingToCart(false)
    }
  }

  if (loading) {
    return (
      <div className={styles.root}>
        <Navbar activeLink="Shop" cartCount={3} />
        <main className={styles.main} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <p style={{ color: '#6d7a76', fontSize: '1.125rem' }}>Loading product details…</p>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className={styles.root}>
        <Navbar activeLink="Shop" cartCount={3} />
        <main className={styles.main} style={{ padding: '60px 20px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '16px', color: '#171d1b' }}>Product Not Found</h1>
          <p style={{ color: '#6d7a76', marginBottom: '24px' }}>
            {error || "The product you're looking for doesn't exist or has been removed."}
          </p>
          <Link to="/shop" style={{ display: 'inline-block', padding: '12px 24px', background: '#00685c', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: 600 }}>
            Back to Shop
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  const images = [
    product.image,
    '/assets/product_placeholder.svg',
  ].filter(Boolean)

  return (
    <div className={styles.root}>
      <Navbar activeLink="Shop" />

      <main className={styles.main}>
        <Breadcrumbs
          items={[
            { label: 'Home', path: '/' },
            { label: 'Shop', path: '/shop' },
            { label: product.category, path: '/shop' },
            { label: product.name, path: `/product/${product.id}` },
          ]}
        />

        { }
        <section className={styles.productTopSection}>
          <div className={styles.imagesArea}>
            <div className={styles.mainImageWrap}>
              <img src={activeImg || product.image} alt={product.name} className={styles.mainImage} />
              <button className={styles.zoomBtn} aria-label="Zoom image">
                <IconSearchZoom />
              </button>
            </div>

            <div className={styles.thumbnails}>
              {images.map((img, i) => (
                <button
                  key={i}
                  className={`${styles.thumbBtn} ${(activeImg || product.image) === img ? styles.thumbBtnActive : ''}`}
                  onClick={() => setActiveImg(img)}
                >
                  <img src={img} alt={`Thumbnail ${i + 1}`} className={styles.thumbImg} />
                </button>
              ))}
            </div>
          </div>

          <div className={styles.detailsArea}>
            {product.badge && <span className={styles.bestSellerBadge}>{product.badge}</span>}
            <h1 className={styles.productTitle}>{product.name}</h1>

            <div className={styles.ratingRow}>
              <StarRating rating={product.rating} />
              <span className={styles.reviewsCount}>({product.reviews} Reviews)</span>
              <span className={styles.metaDivider}>|</span>
              <span className={styles.inStockStatus}>
                <span className={styles.greenDot} style={{ background: product.stock > 0 ? '#00685c' : '#d93838' }} />
                {product.stock > 0 ? `In Stock (${product.stock} left)` : 'Out of Stock'}
              </span>
            </div>

            <div className={styles.priceRow}>
              <span className={styles.currentPrice}>${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className={styles.originalPrice}>${product.originalPrice.toFixed(2)}</span>
              )}
            </div>

            <p className={styles.productDesc}>
              {product.description || 'Premium craftsmanship and high-performance design engineered to elevate your daily routine.'}
            </p>

            <div className={styles.selectorGroup}>
              <h3 className={styles.selectorTitle}>
                CATEGORY: <span className={styles.colorName}>{product.category.toUpperCase()}</span>
              </h3>
            </div>

            {cartMsg && (
              <div style={{
                padding: '10px 16px',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: 600,
                marginBottom: '16px',
                background: cartMsg.includes('successfully') ? '#e6f5f2' : '#fef2f2',
                color: cartMsg.includes('successfully') ? '#00685c' : '#991b1b',
                border: `1px solid ${cartMsg.includes('successfully') ? '#b2e2d8' : '#fecaca'}`
              }}>
                {cartMsg}
              </div>
            )}

            <div className={styles.actionRow}>
              <QuantitySelector
                quantity={quantity}
                onChange={setQuantity}
                size="large"
              />
              <button
                className={styles.btnAddToCart}
                disabled={addingToCart}
                onClick={isInCart ? () => navigate('/cart') : handleAddToCart}
                style={{
                  background: isInCart ? '#00685c' : undefined
                }}
              >
                <IconCart /> {addingToCart ? 'Adding…' : (isInCart ? 'Go to Cart →' : 'Add to Cart')}
              </button>
            </div>

            {product.stock > 0 && (
              <button
                className={styles.btnBuyNow}
                disabled={addingToCart}
                onClick={handleBuyNow}
              >
                Buy Now
              </button>
            )}

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

        { }
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
              Reviews ({product.reviews})
            </button>
          </div>

          <div className={styles.tabContent}>
            {activeTab === 'description' && (
              <div className={styles.tabLayout}>
                <div className={styles.descriptionTextWrap}>
                  <h2 className={styles.tabSubTitle}>Product Overview</h2>
                  <p className={styles.tabParagraph}>
                    {product.description || 'Designed for high performance and durability, this product meets the highest standards of quality and user experience.'}
                  </p>

                  <div className={styles.highlightsGrid}>
                    <div className={styles.highlightBox}>
                      <h4 className={styles.highlightTitle}>Stock Available</h4>
                      <p className={styles.highlightDesc}>{product.stock} units currently in stock.</p>
                    </div>
                    <div className={styles.highlightBox}>
                      <h4 className={styles.highlightTitle}>Rating</h4>
                      <p className={styles.highlightDesc}>{product.rating} / 5 average user rating.</p>
                    </div>
                  </div>
                </div>

                <div className={styles.technicalHighlights}>
                  <h3 className={styles.techTableTitle}>Details</h3>
                  <table className={styles.techTable}>
                    <tbody>
                      <tr>
                        <td className={styles.techKey}>Product ID</td>
                        <td className={styles.techVal}>#{product.id}</td>
                      </tr>
                      <tr>
                        <td className={styles.techKey}>Category</td>
                        <td className={styles.techVal}>{product.category}</td>
                      </tr>
                      <tr>
                        <td className={styles.techKey}>Price</td>
                        <td className={styles.techVal}>${product.price.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td className={styles.techKey}>Availability</td>
                        <td className={styles.techVal}>{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className={styles.tabSpecsList}>
                <h3 className={styles.techTableTitle}>Full Specifications</h3>
                <p className={styles.tabParagraph}>
                  Category: {product.category} | Product ID: {product.id} | Stock: {product.stock} units
                </p>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className={styles.tabReviewsList}>
                <h3 className={styles.techTableTitle}>Customer Reviews ({product.reviews})</h3>
                <p className={styles.tabParagraph}>Average rating: {product.rating} stars based on {product.reviews} customer ratings.</p>
              </div>
            )}
          </div>
        </section>

        { }
        {relatedProducts.length > 0 && (
          <section className={styles.relatedSection}>
            <div className={styles.relatedHeader}>
              <div>
                <span className={styles.relatedSubTitle}>YOU MIGHT ALSO LIKE</span>
                <h2 className={styles.relatedTitle}>Related Products</h2>
              </div>
            </div>

            <div className={styles.relatedGrid}>
              {relatedProducts.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}

