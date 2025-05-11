'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { createClient } from '../../lib/supabase/client';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Loader from '@/components/Loader';

export default function LoginPage() {
  const router = useRouter();

  // State for form fields and auth flow
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true); // toggle between login and signup
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const [authCheckLoading, setAuthCheckLoading] = useState(true); // waiting on Supabase session check
  const [errorMessage, setErrorMessage] = useState('');

  // Check if user is already logged in and redirect
  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      if (data.user) router.push('/dashboard');
      else setAuthCheckLoading(false);
    };
    checkUser();
  }, [router]);

  // Handles login and signup logic
  const handleAuth = async (e?: React.FormEvent) => {
    if (e) e.preventDefault(); // prevent form reload
    setLoading(true);
    setErrorMessage('');
    const supabase = createClient();

    // If signing up, validate password confirmation
    if (!isLogin && password !== confirmPassword) {
      setLoading(false);
      return setErrorMessage('Passwords do not match.');
    }

    let error;

    if (isLogin) {
      // Log in the user
      ({ error } = await supabase.auth.signInWithPassword({ email, password }));
      if (!error) router.push('/dashboard');
    } else {
      // Check if a profile already exists with this email
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();

      if (existingProfile) {
        setLoading(false);
        return setErrorMessage('An account already exists with this email.');
      }

      // Sign up the user with custom profile data
      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email,
          password,
          options: { data: { firstName, lastName } },
        });

      console.log(signUpData);
      if (signUpError) {
        setLoading(false);
        return setErrorMessage(signUpError.message);
      }

      // Show success message if signup succeeded
      setSignUpSuccess(true);
    }

    setLoading(false);
    if (error) setErrorMessage(error.message);
  };

  // While checking Supabase auth status
  if (authCheckLoading) {
    return (
      <div className='min-h-dvh flex items-center justify-center px-4'>
        <Loader />
      </div>
    );
  }

  return (
    <div className='flex items-center justify-center h-dvh bg-gradient-to-br from-purple-700 via-indigo-600 to-pink-500 px-4'>
      <Card className='mx-auto w-full max-w-md bg-white/95 backdrop-blur shadow-xl rounded-xl overflow-hidden'>
        <div className='max-h-[90vh] overflow-y-auto p-4'>
          {/* Header */}
          <CardHeader className='pb-2'>
            <div className='text-center space-y-2'>
              <h1 className='text-3xl font-extrabold text-purple-700'>
                SetTyme
              </h1>
              <p className='text-gray-600 text-sm'>
                {isLogin
                  ? 'Rally your crew and lock in your festival plans'
                  : 'Join the crew and let’s plan your best fest yet!'}
              </p>
            </div>
          </CardHeader>

          {/* Form Content */}
          <CardContent>
            {signUpSuccess ? (
              // Success state after sign-up
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
              // Main login/signup form
              <form className='space-y-3' onSubmit={handleAuth}>
                {/* First/Last name inputs shown only during signup */}
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

                {/* Email input */}
                <input
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='Email'
                  className='border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 p-3 w-full rounded'
                />

                {/* Password input */}
                <input
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder='Password'
                  className='border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 p-3 w-full rounded'
                />

                {/* Confirm password shown only during signup */}
                {!isLogin && (
                  <input
                    type='password'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder='Confirm Password'
                    className='border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 p-3 w-full rounded'
                  />
                )}

                {/* Submit button with spinner */}
                <button
                  onClick={handleAuth}
                  disabled={loading}
                  className='bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold px-4 py-2 rounded w-full hover:opacity-90 transition flex justify-center items-center gap-2'
                >
                  {loading ? (
                    <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin' />
                  ) : isLogin ? (
                    'Log In'
                  ) : (
                    'Sign Up'
                  )}
                </button>
              </form>
            )}

            {/* Inline error display */}
            {errorMessage && (
              <div className='text-red-700 p-3 rounded text-sm'>
                {errorMessage}
              </div>
            )}
          </CardContent>

          {/* Toggle login/signup and Google auth */}
          {!signUpSuccess && (
            <CardFooter className='text-center mt-4 flex flex-col gap-2'>
              <p className='text-sm text-gray-600'>
                {isLogin
                  ? "Don't have an account?"
                  : 'Already have an account?'}
              </p>
              <button
                onClick={() => {
                  setErrorMessage('');
                  setIsLogin(!isLogin);
                }}
                className='text-purple-700 hover:underline text-sm font-medium'
              >
                {isLogin ? 'Sign Up' : 'Log In'}
              </button>

              {/* Google sign-in button */}
              <div className='mt-4 w-full'>
                <Button
                  variant='outline'
                  className='w-full flex justify-center gap-2 text-sm text-gray-700 hover:text-purple-700 border-gray-300'
                  onClick={async () => {
                    const supabase = createClient();
                    const { error } = await supabase.auth.signInWithOAuth({
                      provider: 'google',
                      options: {
                        redirectTo: `${location.origin}/dashboard`,
                      },
                    });
                    if (error) {
                      setErrorMessage('Google sign-in failed');
                      console.error(error.message);
                    }
                  }}
                >
                  <Image
                    src='web_neutral_rd_na.svg'
                    alt='Google logo'
                    width={25}
                    height={25}
                    className='w-6 h-6'
                  />
                  Continue with Google
                </Button>
              </div>
            </CardFooter>
          )}
        </div>
      </Card>
    </div>
  );
}
