import React, { useState, useEffect } from 'react'
import styles from './Layout.module.css'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { IconSearch, IconHeart, IconCart, IconNexLogo } from './Icons'
import { useAuth } from '../AuthContext'
import { apiGetCart, apiGetWishlist, apiSearchProducts } from '../api'

export function Navbar({ activeAction, activeLink, cartCount: propCartCount, wishlistCount: propWishlistCount }) {
  const { user, isAuthenticated } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const path = location.pathname

  const [liveCartCount, setLiveCartCount] = useState(0)
  const [liveWishlistCount, setLiveWishlistCount] = useState(0)

  
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      setShowDropdown(false)
      return
    }

    const timer = setTimeout(() => {
      setSearchLoading(true)
      apiSearchProducts(searchQuery)
        .then((results) => {
          setSearchResults(results)
          setShowDropdown(true)
        })
        .catch(() => setSearchResults([]))
        .finally(() => setSearchLoading(false))
    }, 250)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      if (searchQuery.trim()) {
        setShowDropdown(false)
        navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`)
      }
    }
  }

  useEffect(() => {
    let isMounted = true
    const fetchCounts = () => {
      if (!isAuthenticated) {
        if (isMounted) {
          setLiveCartCount(0)
          setLiveWishlistCount(0)
        }
        return
      }

      apiGetCart()
        .then((items) => {
          if (isMounted) setLiveCartCount(Array.isArray(items) ? items.length : 0)
        })
        .catch(() => {
          if (isMounted) setLiveCartCount(0)
        })

      apiGetWishlist()
        .then((items) => {
          if (isMounted) setLiveWishlistCount(Array.isArray(items) ? items.length : 0)
        })
        .catch(() => {
          if (isMounted) setLiveWishlistCount(0)
        })
    }

    fetchCounts()
    window.addEventListener('cart-updated', fetchCounts)

    return () => {
      isMounted = false
      window.removeEventListener('cart-updated', fetchCounts)
    }
  }, [isAuthenticated, location.pathname])

  const cartCount = propCartCount !== undefined ? propCartCount : liveCartCount
  const wishlistCount = propWishlistCount !== undefined ? propWishlistCount : liveWishlistCount

  const isCategoriesActive = activeLink ? activeLink === 'Categories' : (path === '/' || path === '/categories')
  const isShopActive = activeLink ? activeLink === 'Shop' : (path === '/shop')

  
  const displayName = user?.profile?.full_name || user?.username || 'User'
  const avatarUrl = user?.profile?.avatar || null

  return (
    <nav className={styles.navbar}>
      <div className={styles.navInner}>
        <Link to="/" className={styles.navLogo}>
          <IconNexLogo />
          <span className={styles.navLogoText}>NexCart</span>
        </Link>

        <div className={styles.searchContainer} style={{ position: 'relative', flex: 1, maxWidth: '320px' }}>
          <div className={styles.searchBar}>
            <span
              className={styles.searchIcon}
              onClick={handleSearchSubmit}
              style={{ cursor: 'pointer' }}
            >
              <IconSearch />
            </span>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchSubmit}
              onFocus={() => searchQuery.trim() && setShowDropdown(true)}
              placeholder="Search products, brands, tech..."
              className={styles.searchInput}
              aria-label="Search products"
            />
          </div>

          {showDropdown && (
            <div className={styles.searchDropdown}>
              {searchLoading ? (
                <div className={styles.searchLoadingItem}>Searching catalog…</div>
              ) : searchResults.length === 0 ? (
                <div className={styles.searchEmptyItem}>No products found for "{searchQuery}"</div>
              ) : (
                searchResults.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className={styles.searchResultItem}
                    onClick={() => {
                      setShowDropdown(false)
                      setSearchQuery('')
                      navigate(`/product/${item.id}`)
                    }}
                  >
                    <img src={item.image} alt={item.name} className={styles.searchItemImg} />
                    <div className={styles.searchItemInfo}>
                      <span className={styles.searchItemTitle}>{item.name}</span>
                      <span className={styles.searchItemMeta}>
                        {item.category} • ${item.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className={styles.navLinks}>
          <Link to="/" className={`${styles.navLink} ${isCategoriesActive ? styles.navLinkActive : ''}`}>Categories</Link>
          <Link to="/shop" className={`${styles.navLink} ${isShopActive ? styles.navLinkActive : ''}`}>Shop</Link>
        </div>

        <div className={styles.navActions}>
          <Link
            to="/wishlist"
            className={`${styles.iconBtn} ${styles.wishlistBtn} ${activeAction === 'wishlist' ? styles.wishlistBtnActive : ''}`}
            aria-label="Wishlist"
          >
            <IconHeart active={activeAction === 'wishlist'} />
            {wishlistCount > 0 && <span className={styles.wishlistDot} />}
          </Link>
          <Link to="/cart" className={`${styles.iconBtn} ${styles.cartBtn}`} aria-label="Cart">
            <IconCart />
            {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
          </Link>
          <span className={styles.navDivider} />

          {isAuthenticated ? (
            <Link to="/profile" className={`${styles.profileBtn} ${activeAction === 'profile' ? styles.profileBtnActive : ''}`} aria-label="Profile">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className={styles.profileAvatar}
                />
              ) : (
                <span className={styles.profileAvatarFallback}>
                  {displayName.charAt(0).toUpperCase()}
                </span>
              )}
            </Link>
          ) : (
            <Link
              to="/sign-in"
              className={`${styles.btnSignIn} ${activeAction === 'signin' ? styles.btnSignInActive : ''}`}
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerBrand}>
          <span className={styles.footerLogoText}>NexCart</span>
          <p className={styles.footerTagline}>
            Elevating the everyday with premium technology and curated retail experiences since 2018.
          </p>
          <div className={styles.socialRow}>
            <a href="#" aria-label="Share" className={styles.socialLink}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" />
              </svg>
            </a>
            <a href="#" aria-label="Globe" className={styles.socialLink}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </a>
            <a href="#" aria-label="Github" className={styles.socialLink}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
            </a>
          </div>
          <p className={styles.footerCopy}>© 2026 NexCart Inc. All rights reserved.</p>
        </div>

        <div className={styles.footerCol}>
          <h3 className={styles.footerColTitle}>COMPANY</h3>
          <ul className={styles.footerLinks}>
            <li><a href="#" className={styles.footerLink}>About Nexa</a></li>
            <li><a href="#" className={styles.footerLink}>Careers</a></li>
            <li><a href="#" className={styles.footerLink}>Press Kit</a></li>
            <li><a href="#" className={styles.footerLink}>Store Locations</a></li>
          </ul>
        </div>

        <div className={styles.footerCol}>
          <h3 className={styles.footerColTitle}>SUPPORT</h3>
          <ul className={styles.footerLinks}>
            <li><a href="#" className={styles.footerLink}>Shipping Policy</a></li>
            <li><a href="#" className={styles.footerLink}>Returns &amp; Refunds</a></li>
            <li><a href="#" className={styles.footerLink}>FAQ &amp; Help Center</a></li>
            <li><a href="#" className={styles.footerLink}>Privacy Statement</a></li>
          </ul>
        </div>

        <div className={styles.footerCol}>
          <h3 className={styles.footerColTitle}>Stay Updated</h3>
          <p className={styles.subscribeText}>Join 50k+ tech enthusiasts.</p>
          <form className={styles.subscribeForm} onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Email address"
              className={styles.subscribeInput}
              required
            />
            <button type="submit" className={styles.btnSubscribe}>Subscribe</button>
          </form>
        </div>
      </div>
      <div className={styles.footerBottomLine}>
        <div className={styles.paymentIcons}>
          <span className={styles.paymentBadge}>Visa</span>
          <span className={styles.paymentBadge}>MC</span>
          <span className={styles.paymentBadge}>Amex</span>
        </div>
      </div>
    </footer>
  )
}
