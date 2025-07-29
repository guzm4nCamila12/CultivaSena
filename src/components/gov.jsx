import React from 'react'
import govLogo from '../assets/img/gov-logo.svg'

export default function gov() {
  return (
    <div className='bg-[#3366CC] w-full z-50 px-4 sm:px-8 md:px-14 lg:px-16 xl:px-18 h-full flex items-center relative' >
      <div className='py-1'>
        <img src={govLogo} alt="" className='h-4' />
      </div>
    </div>
  )
}
