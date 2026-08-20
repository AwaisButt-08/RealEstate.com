import React from 'react'
import {Link} from 'react-router-dom'
import { FaSearch } from 'react-icons/fa'
import {useSelector} from 'react-redux'


function Header() {
  const {currentUser} = useSelector((state) => state.user);

  return (
    <header className='bg-slate-200 shadow-md'>
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to='/'>
        <h1 className="flex-wrap font-bold text-sm flex sm:text-xl">
            <span className="text-slate-500">Sahand</span>
            <span className="text-slate-700">Estate</span>
        </h1>
        </Link>
        <form className='bg-slate-100 p-3 rounded-lg items-center flex'>
          <input  className='bg-transparent focus:outline-none w-24 sm:w-64' type="text" placeholder="Search..." />
          <FaSearch className='text-slate-600' />
        </form>
        <ul className='flex gap-4'>
            <Link to='/'>
            <li className='sm:inline text-slate-700 hidden' >Home</li>
            </Link>
            <Link to='/about'>
            <li className='sm:inline text-slate-700 hidden' >About</li>
            </Link>
            <Link to='/signin'>
            {currentUser ? (
              <img className='rounded-full h-7 w-7 object-cover' src={currentUser.avatar} alt="profile" />
            ) : (
              <li className='sm:inline text-slate-700 hidden' >Sign in</li>
            )}
            </Link>
        </ul>
      </div>
    </header> 
  )
}

export default Header
