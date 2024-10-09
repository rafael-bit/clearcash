"use client";

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const [feedback, setFeedback] = useState<string | null>(null);
  const [email, setEmail] = useState<string>('');
  const [remember, setRemember] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const savedEmail = localStorage.getItem('email') || sessionStorage.getItem('email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRemember(!!localStorage.getItem('email')); 
    }
  }, []);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email')?.toString();
    const password = formData.get('password')?.toString();

    if (!email || !password) {
      setFeedback('Email and password are required.');
      return;
    }

    try {
      const response = await fetch('https://clearcashback.onrender.com/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const responseData = await response.json();

      if (response.ok) {
        setFeedback('Login successful!');
        const { token, id: userId } = responseData;

        if (token && userId) {
          localStorage.setItem('token', token);

          if (remember) {
            localStorage.setItem('email', email);
            sessionStorage.removeItem('email');
          } else {
            sessionStorage.setItem('email', email);
            localStorage.removeItem('email');
          }

          setTimeout(() => router.push(`/home/${userId}`), 100);
        } else {
          setFeedback('Invalid response: token or userId missing.');
        }
      } else {
        handleError(response.status);
      }
    } catch (error: any) {
      setFeedback(`Error: ${error.message}`);
    }
  };

  const handleError = (status: number) => {
    switch (status) {
      case 400:
        setFeedback('Invalid credentials. Please check your email and password.');
        break;
      case 401:
        setFeedback('Incorrect password. Please try again.');
        break;
      default:
        setFeedback(`Unknown error occurred: ${status}`);
    }
  };

  useEffect(() => {
    if (feedback) {
      const timeoutId = setTimeout(() => setFeedback(null), 5000);
      return () => clearTimeout(timeoutId);
    }
  }, [feedback]);

  return (
    <main>
      <section className="h-screen flex bg-gray-200 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <Link href="/" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
            <img className="w-8 h-8 mr-2" src="/icon-init.png" alt="ClearCash logo" />
            ClearCash
          </Link>
          <div className="w-full bg-white rounded-lg shadow dark:border sm:max-w-md dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 sm:p-8">
              <h1 className="text-xl font-bold text-gray-900 md:text-2xl dark:text-white">
                Sign in to your account
              </h1>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="name@company.com"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center text-sm text-gray-500 dark:text-gray-300">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={() => setRemember(!remember)}
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <span className="ml-2">Remember me</span>
                  </label>
                  <Link href="#" className="text-sm font-medium text-gray-600 hover:underline dark:text-white">
                    Forgot password?
                  </Link>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg px-5 py-2.5 dark:bg-gray-600 dark:hover:bg-gray-700"
                >
                  Sign in
                </button>
                {feedback && (
                  <div
                    className={`fixed top-0 p-4 text-sm ${feedback.includes('successful')
                        ? 'text-green-800 bg-green-50 dark:text-green-400 dark:bg-gray-800'
                        : 'text-red-800 bg-red-50 dark:text-red-400 dark:bg-gray-800'
                      }`}
                    role="alert"
                  >
                    <span className="font-medium">{feedback.includes('successful') ? 'Success:' : 'Error:'}</span> {feedback}
                  </div>
                )}
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Don’t have an account?{' '}
                  <Link href="/signup" className="font-medium text-gray-600 hover:underline dark:text-gray-500">
                    Sign up
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};