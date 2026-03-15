'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { label: 'Home',      href: '/' },
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
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full z-40 bg-neutral-900 border-r border-neutral-800
                         transition-all duration-300 ease-in-out overflow-hidden
                         ${isOpen ? 'w-64' : 'w-12'}`}>

        {/* Hamburger button — always visible in the rail */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center w-12 h-12 hover:bg-neutral-800 transition-colors cursor-pointer flex-shrink-0"
          aria-label="Toggle menu"
        >
          <div className="flex flex-col gap-1.5 w-5">
            <span className={`block h-0.5 bg-neutral-100 transition-all duration-300 origin-center
              ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block h-0.5 bg-neutral-100 transition-all duration-300
              ${isOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 bg-neutral-100 transition-all duration-300 origin-center
              ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </button>

        {/* Nav links — only visible when open */}
        <nav className={`flex flex-col gap-1 px-2 mt-2 transition-opacity duration-200
                         ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`px-3 py-2 rounded-md text-sm transition-colors whitespace-nowrap
                ${pathname === item.href
                  ? 'bg-neutral-800 text-neutral-100 font-medium'
                  : 'text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100'
                }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  )
}