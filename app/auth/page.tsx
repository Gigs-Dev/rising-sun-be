import React from 'react';
import Image from 'next/image';
import Input from '../components/Input';
import Button from '../components/button';


const Auth = () => {
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <div className="bg-[#2E3C55] min-w-[290px] md:min-w-[540px] min-h-[370px] flex flex-col items-center justify-center p-4 gap-4 rounded-3xl">
        <Image src='/admin.png' width={40} height={40} alt=''/>

        <h1 className='text-[13px]'>Access your account</h1>
        <Input/>
        <Input/>

        <Button/>
      </div>
    </div>
  )
}

export default Auth
