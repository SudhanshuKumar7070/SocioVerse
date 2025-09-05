import React from 'react'
import styles from './InputModified.module.css'
function InputModified({
    type = "text",
    id="",
    label="",
    className="",
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
            className={` placeholder:text-neutral-500 placeholder:font-poppins font-montserrat tracking-tight leading-tight  shadow-md ${className}`}
      />
      {label && <label htmlFor={id} className='font-poppins text-neutral-500 tracking-tight text-sm ' >{label}</label>}
    </div>
  )
}

export default InputModified
