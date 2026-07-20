import React from 'react'
import { Link } from 'react-router-dom'
import styles from './RecentOrdersTable.module.css'

export function RecentOrdersTable() {
  const orders = [
    {
      id: '#NC-84920',
      date: 'Oct 12, 2023',
      total: '$249.00',
      status: 'DELIVERED',
      type: 'delivered',
    },
    {
      id: '#NC-84711',
      date: 'Oct 08, 2023',
      total: '$1,299.00',
      status: 'SHIPPED',
      type: 'shipped',
    },
    {
      id: '#NC-84605',
      date: 'Oct 05, 2023',
      total: '$89.50',
      status: 'PROCESSING',
      type: 'processing',
    },
    {
      id: '#NC-84422',
      date: 'Sep 28, 2023',
      total: '$540.00',
      status: 'DELIVERED',
      type: 'delivered',
    },
  ]

  const getStatusClass = (type) => {
    switch (type) {
      case 'delivered':
        return styles.statusDelivered
      case 'shipped':
        return styles.statusShipped
      case 'processing':
        return styles.statusProcessing
      default:
        return styles.statusDelivered
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>Recent Orders</h2>
        <Link to="#" className={styles.viewAllLink}>
          View All →
        </Link>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ORDER ID</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>STATUS</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className={styles.orderId}>{order.id}</td>
                <td className={styles.date}>{order.date}</td>
                <td className={styles.total}>{order.total}</td>
                <td>
                  <span className={`${styles.statusBadge} ${getStatusClass(order.type)}`}>
                    <span className={styles.dot} /> {order.status}
                  </span>
                </td>
                <td>
                  <Link to="#" className={styles.detailsLink}>Details</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
