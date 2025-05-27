import React from 'react'

function CreatePostButton({
    ...props
}) {
  return (
    <div className='flex flex-col items-center justify-center p-4 bg-blue-300 rounded-lg shadow-lg bg-opacity-15'>
        <button className='flex items-center justify-center w-full h-10 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105' {...props}>
            Create Post
        </button>
    </div>
  )
}

export default CreatePostButton
