import React, { useState } from 'react'
import styles from './OrderSummary.module.css'
import { IconCart, IconCheck } from '../Icons'

export function OrderSummary({ subtotal, tax, isCartEmpty }) {
  const [promoCode, setPromoCode] = useState('SUMMER25')
  const [promoApplied, setPromoApplied] = useState(true)

  const discount = promoApplied && subtotal > 0 ? 25.00 : 0
  const grandTotal = Math.max(0, subtotal + tax - discount)

  return (
    <div className={styles.summaryCard}>
      <h2 className={styles.summaryTitle}>Order Summary</h2>

      <div className={styles.summaryRows}>
        <div className={styles.summaryRow}>
          <span>Subtotal</span>
          <span className={styles.summaryValue}>${subtotal.toFixed(2)}</span>
        </div>
        <div className={styles.summaryRow}>
          <span>Estimated Shipping</span>
          <span className={`${styles.summaryValue} ${styles.shippingFree}`}>FREE</span>
        </div>
        <div className={styles.summaryRow}>
          <span>Tax</span>
          <span className={styles.summaryValue}>${tax.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className={styles.summaryRow}>
            <span>Promo Discount</span>
            <span className={styles.discountValue}>-${discount.toFixed(2)}</span>
          </div>
        )}
      </div>

      {/* Promo Code Box */}
      <div className={styles.promoSection}>
        <label className={styles.promoLabel}>Apply Promo Code</label>
        <div className={styles.promoForm}>
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            className={styles.promoInput}
            placeholder="Enter code"
          />
          <button
            type="button"
            className={styles.btnPromoApply}
            onClick={() => setPromoApplied(true)}
          >
            Apply
          </button>
        </div>
        {promoApplied && subtotal > 0 && (
          <p className={styles.promoSuccessText}>Code SUMMER25 applied ($25 off)</p>
        )}
      </div>

      {/* Grand Total */}
      <div className={styles.grandTotalSection}>
        <div className={styles.grandTotalRow}>
          <span className={styles.grandTotalTitle}>Grand Total</span>
          <span className={styles.grandTotalValue}>${grandTotal.toFixed(2)}</span>
        </div>
        <p className={styles.dutiesSubtext}>Inclusive of all duties</p>
      </div>

      {/* Checkout CTA */}
      <button type="button" className={styles.btnCheckout} disabled={isCartEmpty}>
        Proceed to Checkout <IconCart />
      </button>

      {/* Assurances */}
      <div className={styles.assurances}>
        <div className={styles.assuranceItem}>
          <span className={styles.checkWrap}><IconCheck /></span>
          <span>Secure Encrypted Checkout</span>
        </div>
        <div className={styles.assuranceItem}>
          <span className={styles.checkWrap}><IconCheck /></span>
          <span>30-Day Hassle-Free Returns</span>
        </div>
      </div>
    </div>
  )
}
