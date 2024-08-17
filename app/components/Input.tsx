import Image from 'next/image'
import React from 'react';
import auth from '../constants/auth.png'

const Input = () => {
  return (
    <div className='bg-[#424E65] flex gap-2 p-3 rounded-xl items-center'>
      <Image src={auth} alt='' className='h-5 w-4' />
      <input type='text' placeholder='Admin username......' className='bg-[#424E65] flex items-center justify-center outline-none py-1 pl-1 pr-5 min-h-4 min-w-1/2 md:min-w-[400px]  text-[11px]'/>
    </div> 
  )
}

export default Input

