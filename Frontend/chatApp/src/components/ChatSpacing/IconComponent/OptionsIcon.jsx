import React from 'react'

function OptionsIcon({logo_src,props,classD}) {
  return (
    <span className='h-[1.2em] w-[1.2em] border border-white rounded-lg p-2 '>
       <img src={logo_src}{...props} className={classD} alt="logo" />
    </span>
  )
}

export default OptionsIcon
