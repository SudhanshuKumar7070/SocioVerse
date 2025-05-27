import React from 'react'
import styles from './ModifiedContainer.module.css'
function ModifiedContainer({
    children,
    
}) {
  return (
    <div className={styles.container} >
      {children}
    </div>
  )
}

export default ModifiedContainer
