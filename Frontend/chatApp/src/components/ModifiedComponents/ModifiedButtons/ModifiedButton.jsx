import React from 'react'
import styles from './button.module.css'
function ModifiedButton({
    type = "button",
     children,
    ...props
   
}) {
  return (
    <div className={styles.btnContainer} >
      <button className={styles.btn} {...props} >{children}</button>
    </div>
  )
}

export default ModifiedButton
