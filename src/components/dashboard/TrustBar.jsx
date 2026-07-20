import React from 'react'
import styles from './TrustBar.module.css'
import { IconTruck, IconLock, IconSupport } from '../Icons'

export function TrustBar() {
  return (
    <section className={styles.trustBar}>
      <div className={styles.trustBarInner}>
        <div className={styles.trustItem}>
          <div className={styles.trustIconWrap}>
            <IconTruck />
          </div>
          <div className={styles.trustContent}>
            <h4 className={styles.trustTitle}>Free Premium Shipping</h4>
            <p className={styles.trustDesc}>On all domestic orders over $150</p>
          </div>
        </div>

        <div className={styles.trustItem}>
          <div className={styles.trustIconWrap}>
            <IconLock />
          </div>
          <div className={styles.trustContent}>
            <h4 className={styles.trustTitle}>100% Encrypted Payments</h4>
            <p className={styles.trustDesc}>Verified SSL with industry gateways</p>
          </div>
        </div>

        <div className={styles.trustItem}>
          <div className={styles.trustIconWrap}>
            <IconSupport />
          </div>
          <div className={styles.trustContent}>
            <h4 className={styles.trustTitle}>24/7 Professional Support</h4>
            <p className={styles.trustDesc}>Instant expert chat replies for your queries</p>
          </div>
        </div>
      </div>
    </section>
  )
}
