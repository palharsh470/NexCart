import React, { useState } from 'react'
import styles from './SignInPage.module.css'
import { Navbar, Footer } from '../components/Layout'
import { SocialAuth } from '../components/auth/SocialAuth'
import { IconEye } from '../components/Icons'
import { Link } from 'react-router-dom'

export default function SignInPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const set = (f) => (e) => {
    setForm((p) => ({ ...p, [f]: e.target.value }))
    if (errors[f]) setErrors((p) => ({ ...p, [f]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.email.trim()) e.email = 'Required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.password) e.password = 'Required'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1400))
    setLoading(false)
    setSuccess(true)
  }

  return (
    <div className={styles.root}>
      <Navbar activeAction="signin" />

      <main className={styles.main}>
        {success ? (
          <div className={styles.card}>
            <div className={styles.cardInner}>
              <h1 className={styles.cardTitle}>Signed In Successfully!</h1>
              <p className={styles.cardSub}>Welcome back to NexCart. You are now logged in.</p>
              <button className={styles.btnAuthorize} onClick={() => setSuccess(false)} style={{ marginTop: 24 }}>
                Back to Sign In
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.card}>
            <div className={styles.cardInner}>
              <h1 className={styles.cardTitle}>Sign In to Nexa</h1>
              <p className={styles.cardSub}>
                Access your saved addresses, orders, and payment cards.
              </p>

              <SocialAuth />

              <form onSubmit={handleSubmit} noValidate className={styles.form}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="email">EMAIL ADDRESS</label>
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={set('email')}
                    placeholder="alex.mercer@gmail.com"
                    autoComplete="email"
                    className={`${styles.fieldInput} ${errors.email ? styles.fieldInputError : ''}`}
                  />
                  {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
                </div>

                <div className={styles.fieldGroup}>
                  <div className={styles.labelRow}>
                    <label className={styles.fieldLabel} htmlFor="password">PASSWORD</label>
                    <a href="#" className={styles.forgotLink}>Forgot?</a>
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
        )}
      </main>

      <Footer />
    </div>
  )
}
