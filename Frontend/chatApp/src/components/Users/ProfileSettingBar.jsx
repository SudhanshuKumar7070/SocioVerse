import React from 'react'

function ProfileSettingBar({
    className=""
    
}) {
    const features =["Update Password ", "Update Bio"]
  return (
    <ul className={`flex flex-col items-center justify-start p-2 rounded-xl bg-slate-800/95 backdrop-blur-md shadow-2xl border border-slate-700 overflow-hidden ${className}`}>
       {
        features.map((element,index)=>(
            <li key={index} className='w-full mb-1 last:mb-0'>
              <button className='w-full font-poppins text-sm text-left text-slate-300 hover:text-white bg-transparent hover:bg-slate-700/50 rounded-lg p-3 transition-colors duration-200'>
                {element}
              </button>
            </li>
        ))
       }
    </ul>
  )
}

export default ProfileSettingBar
