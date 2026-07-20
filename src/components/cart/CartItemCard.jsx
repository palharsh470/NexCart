import React from 'react'
import styles from './CartItemCard.module.css'
import { IconTrash } from '../Icons'
import { QuantitySelector } from '../common/QuantitySelector'

export function CartItemCard({ item, onUpdateQuantity, onDelete }) {
  return (
    <div className={styles.cartCard}>
      <div className={styles.cardImageWrap}>
        <img
          src={item.image}
          alt={item.name}
          className={item.id === 1 ? styles.headphonesImg : styles.defaultImg}
        />
      </div>

      <div className={styles.cardDetails}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>{item.name}</h2>
          <button
            type="button"
            className={styles.deleteBtn}
            onClick={() => onDelete(item.id)}
            aria-label="Remove item"
          >
            <IconTrash />
          </button>
        </div>

        <p className={styles.cardVariant}>
          Variant: {item.variant} • {item.extra}
        </p>

        <div className={styles.cardFooter}>
          <QuantitySelector
            quantity={item.quantity}
            onChange={(newQty) => onUpdateQuantity(item.id, newQty - item.quantity)}
            size="medium"
          />

          <div className={styles.priceColumn}>
            {item.originalPrice && (
              <span className={styles.originalPrice}>
                ${(item.originalPrice * item.quantity).toFixed(2)}
              </span>
            )}
            <span className={styles.currentPrice}>
              ${(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
