import React from 'react'
import styles from './QuantitySelector.module.css'

export function QuantitySelector({ quantity, onChange, size = 'medium' }) {
  const isLarge = size === 'large'

  return (
    <div className={`${styles.quantitySelect} ${isLarge ? styles.quantitySelectLarge : ''}`}>
      <button
        type="button"
        className={styles.qtyBtn}
        onClick={() => onChange(Math.max(1, quantity - 1))}
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span className={styles.qtyVal}>{quantity}</span>
      <button
        type="button"
        className={styles.qtyBtn}
        onClick={() => onChange(quantity + 1)}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  )
}
