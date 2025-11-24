import React from "react";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

function Header() {
  return (
    <Header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center mx-auto p-6 mx-w-3xl">
        <h1 className="flex flex-wrap font-bold text-sm sm:text-xl ">
          <span className="text-slate-500">Sahand</span>
          <span className="text-slate-500">Estate</span>
        </h1>
        <form className="text-slate-100 rounded-lg p-3 flex">
          <input
            type="text"
            placeholder="Search...."
            className="bg-transparent"
          />
          <button>
            <FaSearch className="text-slate-600" />
          </button>
        </form>
         <ul className='flex gap-4'>
          <Link to='/'>
            <li className='hidden sm:inline text-slate-700 hover:underline'>
              Home
            </li>
          </Link>
          <Link to='/about'>
            <li className='hidden sm:inline text-slate-700 hover:underline'>
              About
            </li>
          </Link>
          <Link to='/sign-in'>
            <li className='hidden sm:inline text-slate-700 hover:underline'>
              Sign in
            </li>
          </Link>
        </ul>
      </div>
    </Header>
  );
}

export default Header;
