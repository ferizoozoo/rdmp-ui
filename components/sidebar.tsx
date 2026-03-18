'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { jwtDecode } from 'jwt-decode'
import useUser from '@/app/hooks/useUser'
import { getById } from '@/app/lib/services/user.service'

const navItems = [
  { label: 'Home',      href: '/' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Projects',  href: '/projects'  },
  { label: 'Analytics', href: '/analytics' },
  { label: 'Settings',  href: '/settings'  },
]

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [user, setUser] = useState<{name: string, email: string} | null>(null)
  const pathname = usePathname()
  const { token, logout } = useUser()
  const dropdownRef = useRef<HTMLDivElement>(null)

    // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)

    async function fetchUser() {
      if (!token) {
        setUser(null)
        return
      }

      try {
        const decoded = jwtDecode<{ sub?: string; userId?: string; id?: string }>(token)
        const userId = decoded.userId ?? decoded.sub ?? decoded.id

        if (!userId) {
          console.error('No user id found in token payload')
          setUser(null)
          return
        }

        const data = await getById(userId)
        console.log('User data:', data)
        setUser(data)
      } catch (error) {
        console.error('Failed to decode token or fetch user', error)
        setUser(null)
      }
    }

    fetchUser()
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [token])

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
                         transition-all duration-300 ease-in-out overflow-visible flex flex-col
                         ${isOpen ? 'w-64' : 'w-12'}`}>

        {/* Hamburger */}
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

        {/* Nav links */}
        <nav className={`flex flex-col gap-1 px-2 mt-2 flex-1 transition-opacity duration-200
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

        {/* User section — bottom */}
        <div ref={dropdownRef} className={`relative border-t border-neutral-800 transition-all duration-300
                         ${isOpen ? 'p-3' : 'p-1.5'}`}>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div className={`absolute bottom-full mb-2 bg-neutral-800 border border-neutral-700
                             rounded-xl shadow-xl overflow-hidden z-50
                             ${isOpen ? 'left-3 right-3' : 'left-0 w-48'}`}>
              {/* User info header */}
              <div className="px-4 py-3 border-b border-neutral-700">
                <p className="text-sm font-semibold text-neutral-100 truncate">
                  {user?.name ?? 'User'}
                </p>
                <p className="text-xs text-neutral-500 truncate">{user?.email}</p>
              </div>

              {/* Menu items */}
              {/* <div className="p-1">
                <Link
                  href="/settings"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-neutral-300
                             hover:bg-neutral-700 hover:text-neutral-100 transition-colors"
                >
                  <span>⚙</span> Settings
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-neutral-300
                             hover:bg-neutral-700 hover:text-neutral-100 transition-colors"
                >
                  <span>👤</span> Profile
                </Link>
              </div> */}

              {/* Logout */}
              <div className="p-1 border-t border-neutral-700">
                <button
                  onClick={() => { setDropdownOpen(false); logout(); }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm
                             text-red-400 hover:bg-red-400/10 transition-colors"
                >
                  <span>⏻</span> Log out
                </button>
              </div>
            </div>
          )}

          {/* Avatar trigger */}
          {isOpen ? (
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full flex items-center gap-3 rounded-xl p-1 hover:bg-neutral-800
                         transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center
                              text-xs font-black text-neutral-950 flex-shrink-0">
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium text-neutral-100 truncate">
                  {user?.name ?? 'User'}
                </p>
                <p className="text-xs text-neutral-500 truncate">{user?.email}</p>
              </div>
              <span className={`text-neutral-500 text-xs transition-transform duration-200 flex-shrink-0
                                ${dropdownOpen ? 'rotate-180' : ''}`}>
                ▲
              </span>
            </button>
          ) : (
            <button
              onClick={() => { setIsOpen(true); setDropdownOpen(true) }}
              className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center
                         text-xs font-black text-neutral-950 mx-auto cursor-pointer
                         hover:bg-orange-400 transition-colors"
              title={user?.name ?? user?.email}
            >
            </button>
          )}
        </div>

      </aside>
    </>
  )
}
