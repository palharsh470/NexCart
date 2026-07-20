import React from 'react'
import { Link } from 'react-router-dom'
import styles from './Breadcrumbs.module.css'

export function Breadcrumbs({ items = [] }) {
  return (
    <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        return (
          <React.Fragment key={index}>
            {index > 0 && <span className={styles.separator}>&gt;</span>}
            {isLast || !item.path ? (
              <span className={`${styles.crumb} ${styles.crumbActive}`}>
                {item.label}
              </span>
            ) : (
              <Link to={item.path} className={styles.crumb}>
                {item.label}
              </Link>
            )}
          </React.Fragment>
        )
      })}
    </nav>
  )
}
