import React from 'react'
import { Link } from 'react-router-dom'
import styles from './ProductCard.module.css'
import { IconHeart } from '../Icons'
import { StarRating } from './StarRating'

export function ProductCard({ product, isFavorite, onToggleFavorite }) {
  const { id, name, brand, price, originalPrice, rating, reviews, badge, image } = product

  return (
    <div className={styles.productCard}>
      <div className={styles.imageWrap}>
        <Link to={`/product/${id}`} style={{ display: 'block', width: '100%', height: '100%' }}>
          <img src={image} alt={name} className={styles.productImg} />
        </Link>
        {badge && (
          <span className={`${styles.badge} ${badge === 'NEW' ? styles.badgeNew : styles.badgeSale}`}>
            {badge}
          </span>
        )}
        {onToggleFavorite && (
          <button
            type="button"
            className={styles.favoriteBtn}
            onClick={() => onToggleFavorite(id)}
            aria-label="Add to wishlist"
          >
            <IconHeart active={isFavorite} />
          </button>
        )}
      </div>

      <div className={styles.productInfo}>
        {brand && <span className={styles.productBrand}>{brand}</span>}
        <h2 className={styles.productName}>
          <Link to={`/product/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            {name}
          </Link>
        </h2>
        {rating && (
          <div className={styles.ratingRow}>
            <StarRating rating={rating} />
            {reviews && <span className={styles.reviewsCount}>({reviews})</span>}
          </div>
        )}
        <div className={styles.priceRow}>
          <span className={styles.currentPrice}>${price.toFixed(2)}</span>
          {originalPrice && (
            <span className={styles.originalPrice}>${originalPrice.toFixed(2)}</span>
          )}
        </div>
      </div>
    </div>
  )
}
