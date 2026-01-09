import React, {useState} from 'react'
// import { Image } from '@imagekit/react';
import Img from './Image.jsx';
import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, UserButton, useAuth } from '@clerk/clerk-react';
import { useEffect } from 'react';


function Navbar() {

  const [open, setOpen] = useState(false)

  const {getToken} = useAuth()

  useEffect(()=>{

    getToken().then((token)=>console.log(token))
  },[])

  return (

    <div className='w-full h-16 md:h-20 flex items-center justify-between'>
      {/* LOGO */}
      <Link to='/' className='flex items-center gap-4 text-2xl font-bold'>
        <Img src='/logo.png' alt="Gech" w={32} h={32}/>
        <span>Gech</span>
      </Link>
      {/* MOBILE MENU */}
      <div className='md:hidden'>
        {/* MOBILE BUTTON */}
        <div className='cursor-pointer text-2xl' onClick={() => setOpen(prev => !prev)}>
          {open? "X":"☰"}
        </div>
        {/* MOBILE LINK LIST */}
        <div className={`w-full h-screen flex flex-col items-center justify-center absolute top-16 gap-8 font-medium text-lg transition-all ease-in-out ${open? "right-0":"-right-100"}`}>
            <Link to="/">Home</Link>
            <Link to="/trending">Trending</Link>
            <Link to="/popular">Most Popular</Link>
            <Link to="/about">About</Link>
            <Link to="/login">
              <button className='py-2 px-4 rounded-3xl bg-blue-800 text-white'>Login 👋</button>
            </Link>
        </div>
      </div>
      {/* DESKTOP MENU */}
      <div className='hidden md:flex items-center gap-8 xl:gap-12 font-medium'>
        <Link to="/">Home</Link>
        <Link to="/trending">Trending</Link>
        <Link to="/popular">Most Popular</Link>
        <Link to="/about">About</Link>
        <SignedOut>
            <Link to="/login">
          <button className='py-2 px-4 rounded-3xl bg-blue-800 text-white'>Login 👋</button>
        </Link>
        </SignedOut>
      <SignedIn>
        <UserButton/>
      </SignedIn>
      </div>
    </div>
  )
}

export default Navbar
