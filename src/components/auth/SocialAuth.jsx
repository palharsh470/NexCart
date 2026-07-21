import React, { useState } from 'react'
import styles from './SocialAuth.module.css'
import { IconGoogle, IconGithub } from '../Icons'

export function SocialAuth({ dividerText = "OR SECURE CREDENTIAL" }) {
  const [toast, setToast] = useState('')

  const handleSocial = (provider) => {
    setToast(`${provider} login coming soon!`)
    setTimeout(() => setToast(''), 3000)
  }

  return (
    <>
      {toast && <div className={styles.toast}>{toast}</div>}
      <div className={styles.socialRow}>
        <button type="button" className={styles.btnSocial} onClick={() => handleSocial('Google')}>
          <IconGoogle /> Google
        </button>
        <button type="button" className={styles.btnSocial} onClick={() => handleSocial('Github')}>
          <IconGithub /> Github
        </button>
      </div>

      <div className={styles.divider}>
        <span className={styles.dividerLine} />
        <span className={styles.dividerText}>{dividerText}</span>
        <span className={styles.dividerLine} />
      </div>
    </>
  )
}

