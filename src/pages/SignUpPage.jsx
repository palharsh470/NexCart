import React, { useState } from 'react'
import styles from './SignUpPage.module.css'
import { Navbar, Footer } from '../components/Layout'
import { SocialAuth } from '../components/auth/SocialAuth'
import { IconEye } from '../components/Icons'
import { Link, useNavigate } from 'react-router-dom'
import { apiRegister } from '../api'
import { useAuth } from '../AuthContext'

export default function SignUpPage() {
  const [form, setForm] = useState({ username: '', fullName: '', email: '', password: '', confirm: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [showConf, setShowConf] = useState(false)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const { isAuthenticated } = useAuth()
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
    if (!form.fullName.trim()) e.fullName = 'Required'
    if (!form.email.trim())    e.email    = 'Required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.password)        e.password  = 'Required'
    else if (form.password.length < 8) e.password = 'Min. 8 characters'
    if (form.confirm !== form.password) e.confirm = 'Passwords do not match'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    setServerError('')

    try {
      await apiRegister({
        username: form.username,
        email: form.email,
        password: form.password,
        confirm_password: form.confirm,
        full_name: form.fullName,
      })
      setSuccess(true)
    } catch (err) {
      if (err.fieldErrors) {
        const mapped = {}
        // Map Django field names to form field names
        const fieldMap = {
          username: 'username',
          email: 'email',
          password: 'password',
          confirm_password: 'confirm',
          full_name: 'fullName',
        }
        let hasFieldError = false
        Object.entries(err.fieldErrors).forEach(([key, val]) => {
          const formKey = fieldMap[key] || key
          mapped[formKey] = Array.isArray(val) ? val.join(', ') : val
          hasFieldError = true
        })
        if (hasFieldError) {
          setErrors(mapped)
        } else {
          setServerError('Registration failed. Please try again.')
        }
      } else {
        setServerError(err.message || 'Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.root}>
      <Navbar />

      <main className={styles.main}>
        {success ? (
          <div className={styles.card}>
            <div className={styles.cardInner}>
              <h1 className={styles.cardTitle}>Account Created!</h1>
              <p className={styles.cardSub}>Welcome to NexCart. You can now sign in to your account.</p>
              <Link to="/sign-in" className={styles.btnAuthorize} style={{ display: 'block', textAlign: 'center', textDecoration: 'none', marginTop: 24 }}>
                Go to Sign In
              </Link>
            </div>
          </div>
        ) : (
          <div className={styles.card}>
            <div className={styles.cardInner}>
              <h1 className={styles.cardTitle}>Sign Up to Nexa</h1>
              <p className={styles.cardSub}>
                Create your account to save addresses, orders, and payment cards.
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
                  <label className={styles.fieldLabel} htmlFor="fullName">FULL NAME</label>
                  <input
                    id="fullName"
                    type="text"
                    value={form.fullName}
                    onChange={set('fullName')}
                    placeholder="Alex Mercer"
                    autoComplete="name"
                    className={`${styles.fieldInput} ${errors.fullName ? styles.fieldInputError : ''}`}
                  />
                  {errors.fullName && <span className={styles.fieldError}>{errors.fullName}</span>}
                </div>

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
                  </div>
                  <div className={styles.pwdWrap}>
                    <input
                      id="password"
                      type={showPwd ? 'text' : 'password'}
                      value={form.password}
                      onChange={set('password')}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className={`${styles.fieldInput} ${errors.password ? styles.fieldInputError : ''}`}
                    />
                    <button type="button" className={styles.eyeBtn} onClick={() => setShowPwd(v => !v)} aria-label="Toggle password">
                      <IconEye off={showPwd} />
                    </button>
                  </div>
                  {errors.password && <span className={styles.fieldError}>{errors.password}</span>}
                </div>

                <div className={styles.fieldGroup}>
                  <div className={styles.labelRow}>
                    <label className={styles.fieldLabel} htmlFor="confirm">CONFIRM PASSWORD</label>
                    <Link to="/sign-in" className={styles.forgotLink}>Sign In?</Link>
                  </div>
                  <div className={styles.pwdWrap}>
                    <input
                      id="confirm"
                      type={showConf ? 'text' : 'password'}
                      value={form.confirm}
                      onChange={set('confirm')}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className={`${styles.fieldInput} ${errors.confirm ? styles.fieldInputError : ''}`}
                    />
                    <button type="button" className={styles.eyeBtn} onClick={() => setShowConf(v => !v)} aria-label="Toggle confirm password">
                      <IconEye off={showConf} />
                    </button>
                  </div>
                  {errors.confirm && <span className={styles.fieldError}>{errors.confirm}</span>}
                </div>

                <button
                  type="submit"
                  id="signup-submit"
                  className={styles.btnAuthorize}
                  disabled={loading}
                >
                  {loading
                    ? <><span className={styles.spinner} /> Creating account…</>
                    : 'Create Account'}
                </button>
              </form>

              <p className={styles.switchText}>
                Already on Nexa? <Link to="/sign-in" className={styles.switchLink}>Sign In</Link>
              </p>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

