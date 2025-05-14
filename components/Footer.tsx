'use client';

import { usePathname } from 'next/navigation';

export default function Footer() {
  const route = usePathname();
  const isLoginPage = route === '/login' || route === '/signup';

  return (
    <footer
      className={`w-full text-xs text-center py-3 mt-16 text-muted-foreground ${
        isLoginPage ? 'hidden' : 'block'
      }`}
    >
      {/* // <footer className='w-full text-sm text-center py-3 text-muted-foreground'> */}
      <p>
        Made with 💜 for festival crews – © {new Date().getFullYear()} SetTyme.
      </p>
    </footer>
  );
}
