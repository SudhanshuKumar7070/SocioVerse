import React from 'react'
import {  toast } from 'react-toastify';
function UseToast(
    message
) {
  const notify = ()=>toast(message)
  return (
  {notify}
  )
}

export default UseToast
