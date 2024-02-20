"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Login() {
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const data = {
      email: formData.get('email'),
      password: formData.get('password'),
    };

    try {
      const response = await fetch('http://localhost:8080/api/services/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials. Please try again.');
      }

      const responseData = await response.json();

      if (response.status === 404) {
        setFeedback('User not found. Please check your credentials.');
      } else if (response.status === 200) {
        setFeedback('Login successful!');

      } else {
        setFeedback('Unknown error. Please try again.');
      }
    } catch (error: any) {
      setFeedback(error.message);
      console.error(error);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFeedback(null);
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, [feedback]);

  return (
    <main>
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <Link href="/" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
            <img className="w-8 h-8 mr-2" src="/icon-init.png" alt="logo" />
            ClearCash
          </Link>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Sign in to your account
              </h1>
              <form onSubmit={handleLogin} className="space-y-4 md:space-y-6">
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@company.com"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="remember"
                        aria-describedby="remember"
                        type="checkbox"
                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="remember"
                        className="text-gray-500 dark:text-gray-300">
                        Remember
                      </label>
                    </div>
                  </div>
                  <a href="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</a>
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary-600 hover:bg-primary-700 focus:ring-4 font-medium rounded-lg text-md px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 border"
                >
                  Sign in
                </button>
                {feedback && (
                  <div className={`fixed top-0 p-4 mb-4 text-sm ${feedback.includes('success') ? 'text-green-800 bg-green-50 dark:text-green-400 dark:bg-gray-800' : 'text-red-800 bg-red-50 dark:text-red-400 dark:bg-gray-800'}`} role="alert">
                    <span className="font-medium">{feedback.includes('success') ? 'Success' : 'Error'}</span> {feedback}
                  </div>
                )}
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Don’t have an account yet? <Link href="/signup" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
