'use client'; // Enables client-side rendering in Next.js

import { useState } from 'react';
import { supabase } from '@/lib/supabase'; // Supabase client for auth
import { useRouter } from 'next/navigation'; // Next.js router for redirecting

export default function LoginPage() {
  const router = useRouter();

  // State for user credentials and UI behavior
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Disables button while loading
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and sign-up views

  // Handles both login and signup based on isLogin flag
  const handleAuth = async () => {
    setLoading(true); // Show loading state

    // Choose login or signup based on current state
    const { error } = isLogin
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    setLoading(false); // Reset loading state

    // If successful, redirect to dashboard. Otherwise, show error.
    if (!error) router.push('/dashboard');
    else alert(error.message);
  };

  return (
    <div className='max-w-sm mx-auto mt-20'>
      {/* Page heading changes depending on mode */}
      <h1 className='text-xl font-bold mb-4'>
        {isLogin ? 'Login' : 'Sign Up'}
      </h1>

      {/* Email input field */}
      <input
        type='email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder='Email'
        className='border p-2 w-full mb-3'
      />

      {/* Password input field */}
      <input
        type='password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder='Password'
        className='border p-2 w-full mb-3'
      />

      {/* Submit button - label changes based on login/signup */}
      <button
        onClick={handleAuth}
        disabled={loading}
        className='bg-purple-600 text-white px-4 py-2 rounded w-full'
      >
        {loading ? 'Loading...' : isLogin ? 'Log In' : 'Sign Up'}
      </button>

      {/* Toggle between login and signup modes */}
      <p className='text-center mt-4'>
        {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className='text-purple-600 underline'
        >
          {isLogin ? 'Sign Up' : 'Log In'}
        </button>
      </p>
    </div>
  );
}
