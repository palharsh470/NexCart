import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styles from './RecentOrdersTable.module.css'
import { apiGetOrdersHistory, apiCancelOrder } from '../../api'

export function RecentOrdersTable() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const loadOrders = () => {
    setLoading(true)
    apiGetOrdersHistory()
      .then((data) => {
        setOrders(data)
      })
      .catch((err) => {
        console.warn('Could not load order history:', err)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const handleCancel = async (orderId) => {
    try {
      await apiCancelOrder(orderId)
      loadOrders()
    } catch (err) {
      alert(err.message || 'Could not cancel order')
    }
  }

  const getStatusClass = (type) => {
    switch (type) {
      case 'delivered':
        return styles.statusDelivered
      case 'shipped':
        return styles.statusShipped
      case 'cancelled':
        return styles.statusProcessing
      case 'processing':
      default:
        return styles.statusProcessing
    }
  }

  return (
    <div className={styles.card} id="recent-orders-section">
      <div className={styles.headerRow}>
        <h2 className={styles.title}>Recent Orders</h2>
        <Link to="#" className={styles.viewAllLink}>
          View All →
        </Link>
      </div>

      <div className={styles.tableWrapper}>
        {loading ? (
          <div style={{ padding: '24px', textAlign: 'center', color: '#6d7a76' }}>
            Loading recent orders…
          </div>
        ) : orders.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: '#6d7a76' }}>
            No recent orders found.
          </div>
        ) : (
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
                  <td className={styles.orderId}>{order.orderCode}</td>
                  <td className={styles.date}>{order.date}</td>
                  <td className={styles.total}>{order.total}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${getStatusClass(order.type)}`}>
                      <span className={styles.dot} /> {order.status}
                    </span>
                  </td>
                  <td>
                    {order.status === 'PROCESSING' ? (
                      <button
                        type="button"
                        onClick={() => handleCancel(order.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ba1a1a',
                          fontWeight: 600,
                          fontSize: '0.8125rem',
                          cursor: 'pointer'
                        }}
                      >
                        Cancel
                      </button>
                    ) : (
                      <span className={styles.detailsLink}>Details</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

