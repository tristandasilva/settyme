'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from './ui/button';
import { LogOut, Menu, X } from 'lucide-react';

type NavBarProps = {
  variant?: 'default' | 'gradient';
};

export default function NavBar({ variant = 'default' }: NavBarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const crewIdMatch = pathname.match(/^\/crew\/([^/]+)/);
  const crewId = crewIdMatch ? crewIdMatch[1] : null;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const isGradient = variant === 'gradient';
  const textColor = isGradient ? 'text-white' : 'text-gray-700';
  const hoverColor = isGradient
    ? 'hover:text-purple-200'
    : 'hover:text-purple-700';

  return (
    <nav
      className={`${
        isGradient
          ? 'bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600'
          : 'bg-white/70'
      } backdrop-blur-md shadow-md sticky top-0 z-50 transition-colors duration-300`}
    >
      <div className='max-w-6xl mx-auto px-4 py-3 flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <Link
            href='/dashboard'
            className={`font-bold text-lg ${
              isGradient ? 'text-white' : 'text-purple-700'
            }`}
          >
            SetTyme
          </Link>
          <div className='hidden md:flex items-center space-x-4'>
            <Link
              href='/dashboard'
              className={`text-sm ${textColor} ${hoverColor}`}
            >
              Dashboard
            </Link>
            {crewId && (
              <>
                <Link
                  href={`/crew/${crewId}/packing`}
                  className={`text-sm ${textColor} ${hoverColor}`}
                >
                  Packing List
                </Link>
                <Link
                  href={`/crew/${crewId}/rideshare`}
                  className={`text-sm ${textColor} ${hoverColor}`}
                >
                  Rideshare
                </Link>
              </>
            )}
          </div>
        </div>
        <div className='hidden md:flex items-center'>
          <Button
            variant='ghost'
            className={`${
              isGradient
                ? 'text-white hover:bg-white/10'
                : 'text-purple-700 hover:bg-purple-100'
            } text-sm flex items-center gap-1`}
            onClick={handleLogout}
          >
            <LogOut size={16} />
            Log Out
          </Button>
        </div>
        <div className='md:hidden flex items-center'>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`${
              isGradient ? 'text-white' : 'text-purple-700'
            } hover:text-purple-900 focus:outline-none`}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className='md:hidden px-4 pb-6'>
          <div className='flex flex-col space-y-4'>
            <Link
              href='/dashboard'
              className={`text-sm ${textColor} ${hoverColor} active:underline underline-offset-4`}
            >
              Dashboard
            </Link>
            {crewId && (
              <>
                <Link
                  href={`/crew/${crewId}/packing`}
                  className={`text-sm ${textColor} ${hoverColor} active:underline underline-offset-4`}
                >
                  Packing List
                </Link>
                <Link
                  href={`/crew/${crewId}/rideshare`}
                  className={`text-sm ${textColor} ${hoverColor} active:underline underline-offset-4`}
                >
                  Rideshare
                </Link>
              </>
            )}
            <Button
              variant='ghost'
              className={`${
                isGradient
                  ? 'text-white hover:bg-white/10'
                  : 'text-purple-700 hover:bg-purple-100'
              } text-sm flex items-center gap-1`}
              onClick={handleLogout}
            >
              <LogOut size={16} />
              Log Out
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
