import React from 'react'

function ProfileSettingBar({
    className=""
    
}) {
    const features =["Update Password ", "Update Bio"]
  return (
    <ul className={`flex flex-col items-center justify-center sm:h-330px sm:w-250px p-2 rounded-lg  bg-slate-900 shadow-xl bg-opacity-85 overflow-x-hidden overflow-y-scroll scroll-smooth scroll-m-2 scrollbar-custom ${className} absolute ` }>
       {
        features.map((element,index)=>(
            <li key={index} className='w-full px-2 py-1 my-2'><span className='font-montserrat  cursor-pointer hover:transition-all duration-300 ease-linear hover:text-blue-500 bg-opacity-90 shadow-xl bg-blue-200 text-blue-800  rounded-lg p-2 w-full'>
                {element}
                </span></li>
        )
        )
       }
    </ul>
  )
}

export default ProfileSettingBar
