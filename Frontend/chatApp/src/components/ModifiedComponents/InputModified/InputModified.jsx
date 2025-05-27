import React from 'react'
import styles from './InputModified.module.css'
function InputModified({
    type = "text",
    id="",
    label="",
    placeholder="",
    ...props
}) {
  return (
    <div className={styles.inputField} >
        
        <input 
            type={type} 
            id={id} 
            placeholder={placeholder} 
            required
            autoComplete="off"
            {...props}
      />
      {label && <label htmlFor={id} >{label}</label>}
    </div>
  )
}

export default InputModified
