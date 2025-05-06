'use client';

import { useEffect, useState } from 'react';
import { createClient } from '../../lib/supabase/client';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      if (data.user) router.push('/dashboard');
    };
    checkUser();
  }, [router]);

  const handleAuth = async () => {
    setLoading(true);
    const supabase = createClient();

    if (!isLogin && password !== confirmPassword) {
      setLoading(false);
      return alert('Passwords do not match!');
    }

    let error;

    if (isLogin) {
      ({ error } = await supabase.auth.signInWithPassword({ email, password }));
      if (!error) router.push('/dashboard');
    } else {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { firstName, lastName },
        },
      });

      error = signUpError;

      if (!error) {
        setSignUpSuccess(true);
      }
    }

    setLoading(false);
    if (error) alert(error.message);
  };

  return (
    <div className='flex items-center justify-center h-dvh bg-gradient-to-br from-purple-700 via-indigo-600 to-pink-500 px-4'>
      <Card className='mx-auto w-full max-w-md bg-white/95 backdrop-blur shadow-xl rounded-xl'>
        <CardHeader>
          <div className='text-center space-y-2'>
            <h1 className='text-3xl font-extrabold text-purple-700'>SetTyme</h1>
            <p className='text-gray-600 text-sm'>
              {isLogin
                ? 'Welcome back, festie fam ✨'
                : 'Join the crew and let’s plan your best fest yet!'}
            </p>
          </div>
        </CardHeader>

        <CardContent className='space-y-4'>
          {/* Confirmation message replaces form on sign-up success */}
          {signUpSuccess ? (
            <div className='text-center space-y-3'>
              <h2 className='text-xl font-semibold text-purple-700'>
                🎉 Almost there!
              </h2>
              <p className='text-gray-600'>
                Please check your email to confirm your account before logging
                in.
              </p>
            </div>
          ) : (
            <>
              {!isLogin && (
                <>
                  <input
                    type='text'
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder='First Name'
                    className='border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 p-3 w-full rounded'
                  />
                  <input
                    type='text'
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder='Last Name'
                    className='border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 p-3 w-full rounded'
                  />
                </>
              )}

              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Email'
                className='border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 p-3 w-full rounded'
              />

              <input
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Password'
                className='border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 p-3 w-full rounded'
              />

              {!isLogin && (
                <input
                  type='password'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder='Confirm Password'
                  className='border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 p-3 w-full rounded'
                />
              )}

              <button
                onClick={handleAuth}
                disabled={loading}
                className='bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold px-4 py-2 rounded w-full hover:opacity-90 transition'
              >
                {loading ? 'Loading...' : isLogin ? 'Log In' : 'Sign Up'}
              </button>
            </>
          )}
        </CardContent>

        {!signUpSuccess && (
          <CardFooter className='text-center mt-4 flex flex-col gap-2'>
            <p className='text-sm text-gray-600'>
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
            </p>
            <button
              onClick={() => setIsLogin(!isLogin)}
              className='text-purple-700 hover:underline text-sm font-medium'
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
