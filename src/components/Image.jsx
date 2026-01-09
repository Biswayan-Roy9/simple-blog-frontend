// import React from 'react'
import { Image } from '@imagekit/react';


function Img({src, className, w, h, alt}) {
  return (
    <Image urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT} src={src} className={className} loading='lazy' lqip={{active:true, quality:20}} alt={alt} width={w} height={h} 
    transformation={[{
      
      width:w, 
      height:h
    }]}
    
    />
  )
}

export default Img
