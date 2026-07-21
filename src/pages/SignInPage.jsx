import React, { useState } from 'react'
import styles from './SignInPage.module.css'
import { Navbar, Footer } from '../components/Layout'
import { SocialAuth } from '../components/auth/SocialAuth'
import { IconEye } from '../components/Icons'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'

export default function SignInPage() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  // If already logged in, redirect to home
  React.useEffect(() => {
    if (isAuthenticated) navigate('/', { replace: true })
  }, [isAuthenticated, navigate])

  const set = (f) => (e) => {
    setForm((p) => ({ ...p, [f]: e.target.value }))
    if (errors[f]) setErrors((p) => ({ ...p, [f]: '' }))
    if (serverError) setServerError('')
  }

  const validate = () => {
    const e = {}
    if (!form.username.trim()) e.username = 'Required'
    if (!form.password) e.password = 'Required'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    setServerError('')

    try {
      await login(form.username, form.password)
      // AuthContext sets user → useEffect redirects to /
    } catch (err) {
      if (err.fieldErrors?.error) {
        setServerError(err.fieldErrors.error)
      } else if (err.fieldErrors) {
        // Map Django field errors
        const mapped = {}
        Object.entries(err.fieldErrors).forEach(([key, val]) => {
          mapped[key] = Array.isArray(val) ? val.join(', ') : val
        })
        setErrors(mapped)
      } else {
        setServerError(err.message || 'Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.root}>
      <Navbar activeAction="signin" />

      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.cardInner}>
            <h1 className={styles.cardTitle}>Sign In to Nexa</h1>
            <p className={styles.cardSub}>
              Access your saved addresses, orders, and payment cards.
            </p>

            <SocialAuth />

            {serverError && (
              <div className={styles.serverError}>
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className={styles.form}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel} htmlFor="username">USERNAME</label>
                <input
                  id="username"
                  type="text"
                  value={form.username}
                  onChange={set('username')}
                  placeholder="alex_mercer"
                  autoComplete="username"
                  className={`${styles.fieldInput} ${errors.username ? styles.fieldInputError : ''}`}
                />
                {errors.username && <span className={styles.fieldError}>{errors.username}</span>}
              </div>

              <div className={styles.fieldGroup}>
                <div className={styles.labelRow}>
                  <label className={styles.fieldLabel} htmlFor="password">PASSWORD</label>
                  <Link to="/forgot-password" className={styles.forgotLink}>Forgot?</Link>
                </div>
                <div className={styles.pwdWrap}>
                  <input
                    id="password"
                    type={showPwd ? 'text' : 'password'}
                    value={form.password}
                    onChange={set('password')}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className={`${styles.fieldInput} ${errors.password ? styles.fieldInputError : ''}`}
                  />
                  <button type="button" className={styles.eyeBtn} onClick={() => setShowPwd(v => !v)} aria-label="Toggle password">
                    <IconEye off={showPwd} />
                  </button>
                </div>
                {errors.password && <span className={styles.fieldError}>{errors.password}</span>}
              </div>

              <button
                type="submit"
                id="signin-submit"
                className={styles.btnAuthorize}
                disabled={loading}
              >
                {loading
                  ? <><span className={styles.spinner} /> Authorizing…</>
                  : 'Authorize Sign In'}
              </button>
            </form>

            <p className={styles.switchText}>
              New to Nexa? <Link to="/sign-up" className={styles.switchLink}>Create Account</Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

