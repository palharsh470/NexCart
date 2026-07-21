import React, { useState } from 'react'
import styles from './ForgotPasswordPage.module.css'
import { Navbar, Footer } from '../components/Layout'
import { Link } from 'react-router-dom'
import { apiForgotPassword } from '../api'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) { setError('Email is required'); return }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Enter a valid email'); return }

    setLoading(true)
    setError('')

    try {
      await apiForgotPassword({ email })
      setSuccess(true)
    } catch (err) {
      if (err.fieldErrors?.email) {
        setError(Array.isArray(err.fieldErrors.email) ? err.fieldErrors.email.join(', ') : err.fieldErrors.email)
      } else {
        setError(err.message || 'Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.root}>
      <Navbar />

      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.cardInner}>
            {success ? (
              <>
                <div className={styles.successIcon}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#00685c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <h1 className={styles.cardTitle}>Check Your Email</h1>
                <p className={styles.cardSub}>
                  We've sent a password reset link to <strong>{email}</strong>. Check your inbox and follow the instructions.
                </p>
                <Link to="/sign-in" className={styles.btnSubmit} style={{ textDecoration: 'none', display: 'flex', justifyContent: 'center' }}>
                  Back to Sign In
                </Link>
              </>
            ) : (
              <>
                <div className={styles.lockIcon}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#00685c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <h1 className={styles.cardTitle}>Forgot Password?</h1>
                <p className={styles.cardSub}>
                  Enter the email address associated with your account and we'll send you a link to reset your password.
                </p>

                {error && (
                  <div className={styles.serverError}>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate className={styles.form}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel} htmlFor="resetEmail">EMAIL ADDRESS</label>
                    <input
                      id="resetEmail"
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); if (error) setError('') }}
                      placeholder="alex.mercer@gmail.com"
                      autoComplete="email"
                      className={`${styles.fieldInput} ${error ? styles.fieldInputError : ''}`}
                    />
                  </div>

                  <button
                    type="submit"
                    id="forgot-submit"
                    className={styles.btnSubmit}
                    disabled={loading}
                  >
                    {loading
                      ? <><span className={styles.spinner} /> Sending…</>
                      : 'Send Reset Link'}
                  </button>
                </form>

                <p className={styles.switchText}>
                  Remember your password? <Link to="/sign-in" className={styles.switchLink}>Sign In</Link>
                </p>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
