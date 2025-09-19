import React from 'react'
import { Link } from 'react-router'

const NavBar = () => {
  return (
    <nav className='navbar py-4 px-8 flex justify-between items-center bg-white border-b-4 border-black'>
        <Link to="/">
            <p className='text-3xl font-bold font-mono text-black'>RESUMELY</p>
        </Link>
        <Link to="/upload" className="bg-yellow-300 text-black font-bold py-2 px-4 rounded-lg border-2 border-black shadow-[4px_4px_0px_#000] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
            Upload Resume
        </Link>
    </nav>
  )
}

export default NavBar