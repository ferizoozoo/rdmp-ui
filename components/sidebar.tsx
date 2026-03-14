'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Projects',  href: '/projects'  },
  { label: 'Analytics', href: '/analytics' },
  { label: 'Settings',  href: '/settings'  },
]

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Hamburger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-white border border-gray-200
                   hover:bg-gray-50 transition-colors"
        aria-label="Toggle menu"
      >
        <div className="flex flex-col gap-1.5 w-5">
          <span className={`block h-0.5 bg-gray-800 transition-all duration-300 origin-center
            ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block h-0.5 bg-gray-800 transition-all duration-300
            ${isOpen ? 'opacity-0' : ''}`} />
          <span className={`block h-0.5 bg-gray-800 transition-all duration-300 origin-center
            ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </div>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 z-40 bg-white border-r border-gray-200
                         transform transition-transform duration-300 ease-in-out
                         ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full pt-16 p-4">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`px-3 py-2 rounded-md text-sm transition-colors
                  ${pathname === item.href
                    ? 'bg-gray-100 text-gray-900 font-medium'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>
    </>
  )
}