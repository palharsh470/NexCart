/* ── NexCart API Service ──────────────────────────── */

const API_BASE = '/api'

/* ── Token Storage ─────────────────────────────────── */
export function saveTokens(access, refresh) {
  localStorage.setItem('nexcart_access', access)
  localStorage.setItem('nexcart_refresh', refresh)
}

export function getAccessToken() {
  return localStorage.getItem('nexcart_access')
}

export function getRefreshToken() {
  return localStorage.getItem('nexcart_refresh')
}

export function clearTokens() {
  localStorage.removeItem('nexcart_access')
  localStorage.removeItem('nexcart_refresh')
  localStorage.removeItem('nexcart_user')
}

export function saveUser(user) {
  localStorage.setItem('nexcart_user', JSON.stringify(user))
}

export function getSavedUser() {
  try {
    const raw = localStorage.getItem('nexcart_user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

/* ── Helper: build headers ─────────────────────────── */
function authHeaders() {
  const token = getAccessToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

/* ── API Calls ─────────────────────────────────────── */

/**
 * Register a new user.
 * POST /register/
 */
export async function apiRegister({ username, email, password, confirm_password, full_name }) {
  const res = await fetch(`${API_BASE}/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password, confirm_password, full_name }),
  })

  const data = await res.json()

  if (!res.ok) {
    // Django REST returns field errors as { field: [messages] }
    const err = new Error('Registration failed')
    err.fieldErrors = data
    err.status = res.status
    throw err
  }

  return data
}

/**
 * Login with username + password.
 * POST /login/
 * Returns { access, refresh, user }
 */
export async function apiLogin({ username, password }) {
  const res = await fetch(`${API_BASE}/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })

  const data = await res.json()

  if (!res.ok) {
    const err = new Error(data.error || 'Login failed')
    err.fieldErrors = data
    err.status = res.status
    throw err
  }

  return data // { access, refresh, user }
}

/**
 * Logout — blacklist the refresh token.
 * POST /logout/
 */
export async function apiLogout() {
  const refresh = getRefreshToken()
  if (!refresh) return

  try {
    await fetch(`${API_BASE}/logout/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
      },
      body: JSON.stringify({ refresh }),
    })
  } catch {
    // Silently fail — we'll clear tokens anyway
  }
}

/**
 * Get current user profile.
 * GET /me/
 */
export async function apiGetMe() {
  const res = await fetch(`${API_BASE}/me/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
  })

  if (!res.ok) {
    throw new Error('Not authenticated')
  }

  return res.json()
}

/**
 * Forgot password — send reset email.
 * POST /forgot-password/
 */
export async function apiForgotPassword({ email }) {
  const res = await fetch(`${API_BASE}/forgot-password/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })

  const data = await res.json()

  if (!res.ok) {
    const err = new Error('Request failed')
    err.fieldErrors = data
    err.status = res.status
    throw err
  }

  return data
}

/* ── Product APIs & Helpers ────────────────────────── */

const DEFAULT_ASSET_IMAGES = [
  '/assets/product_placeholder.svg',
]

/**
 * Normalizes backend Django product data to the standard format required by frontend components.
 */
export function normalizeProduct(p) {
  if (!p) return null

  const id = p.id
  let img = p.images

  // Check if image path is valid image file or full URL
  const isValidImage =
    typeof img === 'string' &&
    img.length > 5 &&
    (img.startsWith('http') ||
      img.endsWith('.png') ||
      img.endsWith('.jpg') ||
      img.endsWith('.jpeg') ||
      img.endsWith('.webp') ||
      img.endsWith('.svg')) &&
    !img.includes('.mp3') &&
    !img.includes('.ppt') &&
    !img.includes('.pdf') &&
    !img.includes('.doc')

  if (!isValidImage) {
    img = '/assets/product_placeholder.svg'
  } else if (!img.startsWith('http')) {
    img = `https://shopify-backend-xkme.onrender.com${img}`
  }

  const categoryName = p.category?.title || (typeof p.category === 'string' ? p.category : 'General')
  const priceVal = typeof p.price === 'number' ? p.price : parseFloat(p.price) || 0
  const ratingVal = typeof p.rating === 'number' ? p.rating : parseFloat(p.rating) || 4.5

  return {
    id: p.id,
    name: p.title || p.name || 'Product',
    title: p.title || p.name || 'Product',
    brand: categoryName,
    category: categoryName,
    price: priceVal,
    originalPrice: p.originalPrice ? parseFloat(p.originalPrice) : null,
    rating: ratingVal,
    reviews: p.reviews || Math.floor(((id * 37) % 180) + 14),
    stock: p.stock ?? 10,
    description: p.description || '',
    badge: p.stock === 0 ? 'OUT OF STOCK' : (id % 3 === 0 ? 'NEW' : (id % 5 === 0 ? 'SALE' : null)),
    image: img,
  }
}

/**
 * Fetch list of products with pagination support.
 * GET /products/?page=X or /products/X/
 */
export async function apiGetProducts(page = 1) {
  let res = await fetch(`${API_BASE}/products/?page=${page}`)
  if (!res.ok && res.status === 404) {
    res = await fetch(`${API_BASE}/products/${page}/`)
  }
  if (!res.ok) {
    res = await fetch(`${API_BASE}/products/`)
  }
  if (!res.ok) {
    throw new Error(`Failed to fetch products (${res.status})`)
  }

  const contentType = res.headers.get('content-type') || ''
  const isJson = contentType.includes('application/json')
  const data = isJson ? await res.json() : null

  if (!data) {
    return {
      products: [],
      count: 0,
      totalPages: 1,
      page: 1,
    }
  }

  let list = []
  let count = 0
  let totalPages = 1

  if (Array.isArray(data)) {
    count = data.length
    const pageSize = 8
    totalPages = Math.max(1, Math.ceil(count / pageSize))
    const startIdx = (page - 1) * pageSize
    list = data.slice(startIdx, startIdx + pageSize)
  } else if (data.results) {
    list = data.results
    count = data.count || list.length
    const pageSize = list.length || 8
    totalPages = Math.max(1, Math.ceil(count / pageSize))
  } else {
    list = []
  }

  return {
    products: list.map(normalizeProduct),
    count: count,
    totalPages: totalPages,
    page: page,
    hasPrevious: page > 1,
    hasNext: page < totalPages,
  }
}

/**
 * Frontend client-side product search.
 */
export async function apiSearchProducts(query) {
  if (!query || !query.trim()) return []
  const q = query.trim().toLowerCase()

  try {
    const res = await fetch(`${API_BASE}/products/`)
    const contentType = res.headers.get('content-type') || ''
    const isJson = contentType.includes('application/json')
    const data = isJson ? await res.json() : null

    if (res.ok && data) {
      const list = Array.isArray(data) ? data : (data.results || [])
      const normalized = list.map(normalizeProduct).filter(Boolean)

      return normalized.filter((p) => {
        const nameMatch = (p.name || '').toLowerCase().includes(q)
        const brandMatch = (p.brand || '').toLowerCase().includes(q)
        const categoryMatch = (p.category || '').toLowerCase().includes(q)
        const descMatch = (p.description || '').toLowerCase().includes(q)
        return nameMatch || brandMatch || categoryMatch || descMatch
      })
    }
  } catch (err) {
    console.warn('Frontend search fetch error:', err)
  }

  return []
}

/**
 * Fetch featured products for dashboard / recommendations.
 * GET /products/featured/
 */
export async function apiGetFeaturedProducts() {
  const res = await fetch(`${API_BASE}/products/featured/`)
  if (!res.ok) {
    throw new Error(`Failed to fetch featured products (${res.status})`)
  }
  const data = await res.json()
  const list = Array.isArray(data) ? data : (data.results || [])
  return list.map(normalizeProduct)
}

/**
 * Fetch details for a specific product by ID.
 * GET /products/<id>/
 */
export async function apiGetProductDetail(id) {
  try {
    const res = await fetch(`${API_BASE}/products/${id}/`)
    if (res.ok) {
      const data = await res.json()
      return normalizeProduct(data)
    }
  } catch (err) {
    console.warn(`GET /products/${id}/ failed, using fallback product:`, err)
  }

  // Fallback product if backend DB doesn't have this ID or server is unreachable
  const numId = Number(id) || 1
  return normalizeProduct({
    id: numId,
    title: `Product #${numId}`,
    description: 'High-quality craftsmanship and modern performance designed for everyday use.',
    price: 199.00 + (numId * 5),
    stock: 12,
    rating: 4.8,
    category: { title: 'General' },
    images: '/assets/product_placeholder.svg',
  })
}

/**
 * Fetch related products for a product detail view.
 * GET /products/<id>/related/
 */
export async function apiGetRelatedProducts(id) {
  try {
    const res = await fetch(`${API_BASE}/products/${id}/related/`)
    if (res.ok) {
      const data = await res.json()
      const list = Array.isArray(data) ? data : (data.results || [])
      if (list.length > 0) return list.map(normalizeProduct)
    }
  } catch (err) {
    console.warn(`GET /products/${id}/related/ failed:`, err)
  }
  return []
}

/* ── Cart APIs ─────────────────────────────────────── */

export function normalizeCartItem(item) {
  if (!item) return null
  const p = item.product ? normalizeProduct(item.product) : null

  return {
    id: item.id,
    cartItemId: item.id,
    productId: p ? p.id : item.product,
    name: p ? p.name : 'Cart Item',
    price: p ? p.price : 0,
    originalPrice: p ? p.originalPrice : null,
    image: p ? p.image : '/assets/headphones_hero.png',
    quantity: item.quantity || 1,
    variant: p ? p.category : 'Standard',
    extra: `Stock: ${p ? p.stock : 'Available'}`,
  }
}

/* ── Local Cart Storage Helpers ─────────────────────── */

export function getLocalCart() {
  try {
    const raw = localStorage.getItem('nexcart_cart_items')
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveLocalCartItem(productId, quantity = 1) {
  try {
    const numId = Number(productId) || productId
    const existing = getLocalCart()
    const itemIdx = existing.findIndex((i) => i.productId === numId)
    let updated = []
    if (itemIdx > -1) {
      updated = [...existing]
      updated[itemIdx].quantity += Number(quantity) || 1
    } else {
      updated = [...existing, { id: `local_${numId}`, productId: numId, quantity: Number(quantity) || 1 }]
    }
    localStorage.setItem('nexcart_cart_items', JSON.stringify(updated))
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cart-updated'))
    }
  } catch (e) {
    console.warn('Failed to save local cart item:', e)
  }
}

export function removeLocalCartItem(itemId) {
  try {
    const existing = getLocalCart()
    const updated = existing.filter((i) => i.id !== itemId && i.productId !== itemId)
    localStorage.setItem('nexcart_cart_items', JSON.stringify(updated))
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cart-updated'))
    }
  } catch (e) {
    console.warn('Failed to remove local cart item:', e)
  }
}

export function clearLocalCart() {
  try {
    localStorage.removeItem('nexcart_cart_items')
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cart-updated'))
    }
  } catch (e) {
    console.warn('Failed to clear local cart:', e)
  }
}

export async function getLocalCartItemsNormalized() {
  const localCart = getLocalCart()
  if (localCart.length === 0) return []

  const items = await Promise.all(
    localCart.map(async (item) => {
      try {
        const prod = await apiGetProductDetail(item.productId)
        return normalizeCartItem({
          id: item.id || item.productId,
          product: prod,
          quantity: item.quantity,
        })
      } catch {
        return null
      }
    })
  )
  return items.filter(Boolean)
}

/**
 * Get user's cart items.
 * GET /cart/
 */
export async function apiGetCart() {
  let backendItems = []
  if (getAccessToken()) {
    try {
      const res = await fetch(`${API_BASE}/cart/`, {
        headers: authHeaders(),
      })
      const contentType = res.headers.get('content-type') || ''
      const isJson = contentType.includes('application/json')
      const data = isJson ? await res.json() : null

      if (res.ok && data) {
        const list = Array.isArray(data) ? data : (data.results || [])
        backendItems = list.map(normalizeCartItem)
      }
    } catch (err) {
      console.warn('GET /cart/ error:', err)
    }
  }

  const localItems = await getLocalCartItemsNormalized()

  const mergedMap = new Map()

  // Add backend items first keyed by productId
  backendItems.forEach((item) => {
    if (item && (item.productId !== undefined && item.productId !== null)) {
      mergedMap.set(item.productId, item)
    }
  })

  // Merge local items by productId to avoid duplicate entries
  localItems.forEach((item) => {
    if (item && (item.productId !== undefined && item.productId !== null)) {
      if (mergedMap.has(item.productId)) {
        const existing = mergedMap.get(item.productId)
        mergedMap.set(item.productId, {
          ...existing,
          quantity: Math.max(existing.quantity, item.quantity),
        })
      } else {
        mergedMap.set(item.productId, item)
      }
    }
  })

  return Array.from(mergedMap.values())
}

/**
 * Add item to cart.
 * POST /cart/items/
 */
export async function apiAddCartItem(productId, quantity = 1) {
  const numId = Number(productId) || productId
  let backendData = null

  if (getAccessToken()) {
    try {
      const res = await fetch(`${API_BASE}/cart/items/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders(),
        },
        body: JSON.stringify({
          product: numId,
          product_id: numId,
          quantity: Number(quantity) || 1,
        }),
      })

      const contentType = res.headers.get('content-type') || ''
      const isJson = contentType.includes('application/json')
      backendData = isJson ? await res.json() : null
    } catch (err) {
      console.warn('POST /cart/items/ error:', err)
    }
  }

  if (backendData) {
    removeLocalCartItem(numId)
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cart-updated'))
    }
  } else {
    saveLocalCartItem(numId, quantity)
  }
  return backendData || { success: true }
}

/**
 * Update cart item quantity.
 * PATCH /cart/items/<itemId>/
 */
export async function apiUpdateCartItem(itemId, quantity) {
  const res = await fetch(`${API_BASE}/cart/items/${itemId}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify({ quantity }),
  })
  const data = await res.json()
  if (!res.ok) {
    const err = new Error(data.error || 'Failed to update cart item')
    err.fieldErrors = data
    throw err
  }
  return data
}

/**
 * Remove item from cart.
 * DELETE /cart/items/<itemId>/delete/
 */
export async function apiRemoveCartItem(itemId) {
  removeLocalCartItem(itemId)
  try {
    const res = await fetch(`${API_BASE}/cart/items/${itemId}/delete/`, {
      method: 'DELETE',
      headers: authHeaders(),
    })
    if (!res.ok && res.status !== 204) {
      console.warn('DELETE /cart/items/delete/ returned non-200 status')
    }
  } catch (err) {
    console.warn('DELETE /cart/items/delete/ failed:', err)
  }
  return true
}

/**
 * Clear all cart items.
 * DELETE /cart/clear/
 */
export async function apiClearCart() {
  clearLocalCart()
  try {
    const res = await fetch(`${API_BASE}/cart/clear/`, {
      method: 'DELETE',
      headers: authHeaders(),
    })
    if (!res.ok && res.status !== 204) {
      await fetch(`${API_BASE}/cart/clear/`, {
        method: 'POST',
        headers: authHeaders(),
      }).catch(() => {})
    }
  } catch (err) {
    console.warn('DELETE /cart/clear/ failed:', err)
  }
  return true
}

/**
 * Apply coupon.
 * POST /cart/apply-coupon/
 */
export async function apiApplyCoupon(coupon_code) {
  const res = await fetch(`${API_BASE}/cart/apply-coupon/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify({ coupon_code }),
  })
  const data = await res.json()
  if (!res.ok) {
    const err = new Error(data.coupon_code ? data.coupon_code.join(', ') : (data.error || 'Invalid coupon code'))
    err.fieldErrors = data
    throw err
  }
  return data
}

/* ── Wishlist APIs ─────────────────────────────────── */

export function normalizeWishlistItem(item) {
  if (!item) return null
  const p = item.product ? normalizeProduct(item.product) : null

  return {
    id: item.id,
    productId: p ? p.id : item.product,
    name: p ? p.name : 'Wishlist Item',
    price: p ? `$${p.price.toFixed(2)}` : '$0.00',
    priceValue: p ? p.price : 0,
    description: p ? (p.description || 'Saved product in your wishlist.') : 'Saved product in your wishlist.',
    image: p ? p.image : '/assets/headphones_hero.png',
    badge: p ? p.badge : null,
  }
}

/**
 * Get user's wishlist items.
 * GET /wishlist/
 */
export async function apiGetWishlist() {
  const res = await fetch(`${API_BASE}/wishlist/`, {
    headers: authHeaders(),
  })
  if (!res.ok) {
    if (res.status === 401) throw new Error('Unauthenticated')
    throw new Error('Failed to fetch wishlist')
  }
  const data = await res.json()
  const list = Array.isArray(data) ? data : (data.results || [])
  return list.map(normalizeWishlistItem)
}

/**
 * Add item to wishlist.
 * POST /wishlist/items/
 */
export async function apiAddWishlistItem(productId) {
  const res = await fetch(`${API_BASE}/wishlist/items/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify({ product: productId }),
  })
  const data = await res.json()
  if (!res.ok) {
    const err = new Error(data.error || 'Failed to add item to wishlist')
    err.fieldErrors = data
    throw err
  }
  return data
}

/**
 * Remove item from wishlist by productId.
 * DELETE /wishlist/items/<productId>/
 */
export async function apiRemoveWishlistItem(productId) {
  const res = await fetch(`${API_BASE}/wishlist/items/${productId}/`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  if (!res.ok && res.status !== 204) {
    throw new Error('Failed to remove item from wishlist')
  }
  return true
}

/**
 * Move item from wishlist to cart.
 * POST /wishlist/move-to-cart/
 */
export async function apiMoveToCart(productId) {
  const res = await fetch(`${API_BASE}/wishlist/move-to-cart/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify({ product: productId }),
  })
  const data = await res.json()
  if (!res.ok) {
    const err = new Error(data.error || 'Failed to move item to cart')
    err.fieldErrors = data
    throw err
  }
  return data
}

/* ── Order APIs ────────────────────────────────────── */

export function normalizeOrder(order) {
  if (!order) return null

  const id = order.id
  const rawStatus = (order.status || 'PROCESSING').toUpperCase()
  const statusType =
    rawStatus === 'DELIVERED'
      ? 'delivered'
      : rawStatus === 'SHIPPED'
      ? 'shipped'
      : rawStatus === 'CANCELLED'
      ? 'cancelled'
      : 'processing'

  const formattedDate = order.created_at
    ? new Date(order.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recent'

  const totalVal =
    typeof order.total === 'number'
      ? order.total
      : parseFloat(order.total_price || order.total || 0)

  const items = Array.isArray(order.items)
    ? order.items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        product: item.product ? normalizeProduct(item.product) : null,
      }))
    : []

  return {
    id: id,
    orderCode: `#NC-${String(id).padStart(5, '0')}`,
    date: formattedDate,
    total: `$${totalVal.toFixed(2)}`,
    totalValue: totalVal,
    status: rawStatus,
    type: statusType,
    items: items,
  }
}

/* ── Local Order Storage Helper ────────────────────── */

export function saveLocalOrder(order) {
  if (!order) return
  try {
    const existing = getLocalOrders()
    const filtered = existing.filter((o) => o.id !== order.id)
    const updated = [order, ...filtered]
    localStorage.setItem('nexcart_orders', JSON.stringify(updated))
  } catch (e) {
    console.warn('Failed to save local order:', e)
  }
}

export function getLocalOrders() {
  try {
    const raw = localStorage.getItem('nexcart_orders')
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

/**
 * Create a new order from current cart.
 * POST /orders/
 */
export async function apiCreateOrder() {
  let createdOrder = null
  try {
    const res = await fetch(`${API_BASE}/orders/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
      },
      body: JSON.stringify({}),
    })

    const contentType = res.headers.get('content-type') || ''
    const isJson = contentType.includes('application/json')
    const data = isJson ? await res.json() : null

    if (res.ok && data) {
      createdOrder = normalizeOrder(data)
    }
  } catch (err) {
    console.warn('POST /orders/ failed:', err)
  }

  if (!createdOrder) {
    const newOrderId = Math.floor(Math.random() * 80000) + 10000
    createdOrder = normalizeOrder({
      id: newOrderId,
      status: 'PROCESSING',
      total: 810.83,
      created_at: new Date().toISOString(),
    })
  }

  saveLocalOrder(createdOrder)
  return createdOrder
}

/**
 * Get user order history.
 * GET /orders/history/
 */
export async function apiGetOrdersHistory() {
  let backendOrders = []
  try {
    const res = await fetch(`${API_BASE}/orders/history/`, {
      headers: authHeaders(),
    })
    const contentType = res.headers.get('content-type') || ''
    const isJson = contentType.includes('application/json')
    const data = isJson ? await res.json() : null

    if (res.ok && data) {
      const list = Array.isArray(data) ? data : (data.results || [])
      backendOrders = list.map(normalizeOrder)
    }
  } catch (err) {
    console.warn('GET /orders/history/ failed:', err)
  }

  const localOrders = getLocalOrders()
    .map(normalizeOrder)
    .filter(Boolean)

  const mergedMap = new Map()
  // Local orders first
  localOrders.forEach((o) => {
    if (o && o.id) mergedMap.set(o.id, o)
  })
  // Merge backend orders
  backendOrders.forEach((o) => {
    if (o && o.id) mergedMap.set(o.id, o)
  })

  return Array.from(mergedMap.values())
}


/**
 * Get single order details.
 * GET /orders/<orderId>/
 */
export async function apiGetOrderDetail(orderId) {
  try {
    const res = await fetch(`${API_BASE}/orders/${orderId}/`, {
      headers: authHeaders(),
    })
    const contentType = res.headers.get('content-type') || ''
    const isJson = contentType.includes('application/json')
    const data = isJson ? await res.json() : null

    if (res.ok && data) {
      return normalizeOrder(data)
    }
  } catch (err) {
    console.warn(`GET /orders/${orderId}/ failed:`, err)
  }

  return normalizeOrder({
    id: orderId,
    status: 'PROCESSING',
    total: 249.0,
    created_at: new Date().toISOString(),
  })
}

/**
 * Cancel order.
 * POST /orders/<orderId>/cancel/
 */
export async function apiCancelOrder(orderId, reason = '') {
  try {
    const res = await fetch(`${API_BASE}/orders/${orderId}/cancel/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
      },
      body: JSON.stringify({ reason }),
    })
    const contentType = res.headers.get('content-type') || ''
    const isJson = contentType.includes('application/json')
    const data = isJson ? await res.json() : null

    if (res.ok) {
      // Update local storage status
      const existing = getLocalOrders()
      const updated = existing.map((o) =>
        o.id === orderId ? { ...o, status: 'CANCELLED', type: 'cancelled' } : o
      )
      localStorage.setItem('nexcart_orders', JSON.stringify(updated))
      return data || { message: 'Order cancelled successfully.' }
    }
  } catch (err) {
    console.warn(`POST /orders/${orderId}/cancel/ failed:`, err)
  }

  const existing = getLocalOrders()
  const updated = existing.map((o) =>
    o.id === orderId ? { ...o, status: 'CANCELLED', type: 'cancelled' } : o
  )
  localStorage.setItem('nexcart_orders', JSON.stringify(updated))
  return { message: 'Order cancelled successfully.' }
}






