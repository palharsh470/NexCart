import React, { useState } from 'react'
import styles from './OrderSummary.module.css'
import { IconCart, IconCheck } from '../Icons'
import { apiApplyCoupon } from '../../api'

export function OrderSummary({ subtotal, tax, isCartEmpty, onCheckout, isCheckingOut }) {
  const [promoCode, setPromoCode] = useState('')
  const [promoDiscount, setPromoDiscount] = useState(0)
  const [promoMsg, setPromoMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const handleApplyCoupon = async () => {
    if (!promoCode.trim()) return
    setLoading(true)
    setPromoMsg('')
    try {
      const res = await apiApplyCoupon(promoCode.trim())
      setPromoDiscount(25.00)
      setPromoMsg(res.message || `Coupon ${res.coupon || promoCode} applied successfully!`)
    } catch (err) {
      setPromoDiscount(0)
      setPromoMsg(err.message || 'Invalid coupon code.')
    } finally {
      setLoading(false)
    }
  }

  const discount = subtotal > 0 ? promoDiscount : 0
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


      <div className={styles.promoSection}>
        <label className={styles.promoLabel}>Apply Promo Code</label>
        <div className={styles.promoForm}>
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            className={styles.promoInput}
            placeholder="Enter coupon code"
          />
          <button
            type="button"
            className={styles.btnPromoApply}
            onClick={handleApplyCoupon}
            disabled={loading}
          >
            {loading ? 'Applying…' : 'Apply'}
          </button>
        </div>
        {promoMsg && (
          <p className={styles.promoSuccessText} style={{ color: promoDiscount > 0 ? '#00685c' : '#ba1a1a' }}>
            {promoMsg}
          </p>
        )}
      </div>

      { }
      <div className={styles.grandTotalSection}>
        <div className={styles.grandTotalRow}>
          <span className={styles.grandTotalTitle}>Grand Total</span>
          <span className={styles.grandTotalValue}>${grandTotal.toFixed(2)}</span>
        </div>
        <p className={styles.dutiesSubtext}>Inclusive of all duties</p>
      </div>

      { }
      <button
        type="button"
        className={styles.btnCheckout}
        disabled={isCartEmpty || isCheckingOut}
        onClick={onCheckout}
      >
        {isCheckingOut ? 'Placing Order…' : 'Proceed to Checkout'} <IconCart />
      </button>

      { }
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
