import React from 'react'
import styles from './button.module.css'
function ModifiedButton({
    type = "button",
    className="",
     children,
    ...props
   
}) {
  return (
    <div className="px-4 py-2 " >
      <button className={` border p-2  rounded-md font-montserrat bg-gradient-to-r from-blue-800  via-blue-300 to-blue-800 hover:text-white hover:transition-all duration-150 ease-in-out hover:bg-gradient-to-l hover:from-blue-700 hover:to-blue-300 shadow-md${className}`}>{children}</button>
    </div>
  )
}

export default ModifiedButton
