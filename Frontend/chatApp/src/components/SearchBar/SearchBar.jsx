import React from 'react'
import { forwardRef,ref } from 'react'
import { useState } from 'react'

 const SearchBar = forwardRef(({ className='',
    width='',
    ...props},ref)=>{
      
 return (
    <div className={`sm:min-h-12  rounded-2xl hover:border hover:transition-all  backdrop-blur-md ${width}`}>
      <input type="text" ref={ref}   {...props} className='w-full min-h-14 active:outline-none focus:outline-none rounded-2xl font-montserrat bg-sky-300 bg-opacity-10  px-2 py-2  shadow-lg text-white placeholder:text-slate-400' placeholder='Search...' />
    </div>
  )
})



export default SearchBar
