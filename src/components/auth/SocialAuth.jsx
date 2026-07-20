import React from 'react'
import styles from './SocialAuth.module.css'
import { IconGoogle, IconGithub } from '../Icons'

export function SocialAuth({ dividerText = "OR SECURE CREDENTIAL" }) {
  return (
    <>
      <div className={styles.socialRow}>
        <button type="button" className={styles.btnSocial}>
          <IconGoogle /> Google
        </button>
        <button type="button" className={styles.btnSocial}>
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
