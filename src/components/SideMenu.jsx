import React from 'react'
import Search from '../components/Search'
import { Link, useSearchParams } from 'react-router-dom'

function SideMenu() {


  const [searchParams, setSearchParams] = useSearchParams()

  const handleFilterChange = (e) => {

    //  const value = e.target.value;

  if (searchParams.get("sort") !== e.target.value) {
    setSearchParams({
      ...Object.fromEntries(searchParams.entries()),
      sort: e.target.value,
    });
  }
    
  }

    const handleCatagoryChange = (catagory) => {

    //  const value = e.target.value;

  if (searchParams.get("cat") !== catagory) {
    setSearchParams({
      ...Object.fromEntries(searchParams.entries()),
      cat: catagory,
    });
  }
    
  }

  return (
    <div className='px-4 h-max sticky top-8'>
      <h1 className='mb-4 font-medium text-sm'>Search</h1>
      <Search/>
      <h1 className='mt-8 mb-4 font-medium text-sm'>Filter</h1>
      <div className='flex flex-col gap-2 text-sm'>
        <label htmlFor='' className='flex items-center gap-2 cursor-pointer '>
            <input type='radio' name='sort' onChange={handleFilterChange} value="newest" className='appearance-none w-4 h-4 border-[1.5px] bg-white border-blue-800 cursor-pointer rounded-sm checked:bg-blue-800'/>
            Newest
        </label>
        <label htmlFor='' className='flex items-center gap-2 cursor-pointer '>
            <input type='radio' name='sort' onChange={handleFilterChange} value="popular" className='appearance-none w-4 h-4 border-[1.5px] bg-white border-blue-800 cursor-pointer rounded-sm checked:bg-blue-800'/>
            Most Popular
        </label>
        <label htmlFor='' className='flex items-center gap-2 cursor-pointer'>
            <input type='radio' name='sort' onChange={handleFilterChange} value="treinding" className='appearance-none w-4 h-4 border-[1.5px]  bg-white border-blue-800 cursor-pointer rounded-sm checked:bg-blue-800'/>
            Trending
        </label>
        <label htmlFor='' className='flex items-center gap-2 cursor-pointer'>
            <input type='radio' name='sort' onChange={handleFilterChange} value="oldest" className='appearance-none w-4 h-4 border-[1.5px] bg-white border-blue-800 cursor-pointer rounded-sm checked:bg-blue-800'/>
            Oldest
        </label>
      </div>
      <h1 className='mt-8 mb-4 font-medium text-sm'>Catagories</h1>
      <div className='flex flex-col gap-2 text-sm'>
        <span className="underline cursor-pointer" onClick={()=>handleCatagoryChange("general")}>All</span>
        <span className="underline cursor-pointer" onClick={()=>handleCatagoryChange("web-design")}>Web Design</span>
        <span className="underline cursor-pointer" onClick={()=>handleCatagoryChange("development")}>Development</span>
        <span className="underline cursor-pointer" onClick={()=>handleCatagoryChange("databases")}>Database</span>
        <span className="underline cursor-pointer" onClick={()=>handleCatagoryChange("seo")}>Search Engine</span>
        <span className="underline cursor-pointer" onClick={()=>handleCatagoryChange("marketing")}>Marketing</span>
      </div>
    </div>
  )
}

export default SideMenu
