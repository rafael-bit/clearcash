"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Signup() {
	const [feedback, setFeedback] = useState<string | null>(null);
	const router = useRouter();

	const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const formData = new FormData(event.currentTarget);
		const name = formData.get('name') as string;
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const confirmPassword = formData.get('confirmPassword') as string;

		if (password !== confirmPassword) {
			setFeedback('Passwords do not match.');
			return;
		}

		const data = { name, email, password };

		try {
			const response = await fetch('http://localhost:8080/api/users', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Failed to create an account. Please try again.');
			}

			setFeedback('Account created successfully!');

			setTimeout(() => {
				router.push('/');
			}, 500);
		} catch (error: any) {
			console.error('Submission error:', error);
			setFeedback(error.message);
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
			<div className="w-full h-full z-50 shadow">
				<section className="py-5 bg-gray-50 dark:bg-gray-900">
					<div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
						<Link href="/" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
							<img className="w-8 h-8 mr-2" src="icon-init.png" alt="logo" />
							ClearCash
						</Link>
						<div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
							<div className="p-6 space-y-4 md:space-y-6 sm:p-8">
								<h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
									Create an account
								</h1>
								<form onSubmit={onSubmit} className="space-y-4 md:space-y-6">
									<div>
										<label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
											Your name
										</label>
										<input
											type="text"
											name="name"
											id="name"
											className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
											placeholder="Paul Matter"
											required
										/>
									</div>
									<div>
										<label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
											Your email
										</label>
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
										<label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
											Password
										</label>
										<input
											type="password"
											name="password"
											id="password"
											placeholder="••••••••"
											className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
											required
										/>
									</div>
									<div>
										<label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
											Confirm password
										</label>
										<input
											type="password"
											name="confirmPassword"
											id="confirmPassword"
											placeholder="••••••••"
											className={`bg-gray-50 border ${feedback?.includes('Passwords do not match') ? 'border-red-500' : 'border-gray-300'} text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
											required
										/>
									</div>
									<div className="flex items-start">
										<div className="flex items-center h-5">
											<input
												id="terms"
												aria-describedby="terms"
												type="checkbox"
												className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
												required
											/>
										</div>
										<div className="ml-3 text-sm">
											<label htmlFor="terms" className="font-light text-gray-500 dark:text-gray-300">
												I accept the{' '}
												<Link href="/terms" className="font-medium text-primary-600 hover:underline dark:text-primary-500">
													Terms and Conditions
												</Link>
											</label>
										</div>
									</div>
									<button
										type="submit"
										className="w-full bg-primary-600 hover:bg-primary-700 focus:ring-4 font-medium rounded-lg text-md px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 border dark:text-white"
									>
										Create an account
									</button>
									{feedback && (
										<div className={`fixed top-0 p-4 mb-4 text-sm ${feedback.includes('successfully') ? 'text-green-800 bg-green-50 dark:text-green-400 dark:bg-gray-800' : 'text-red-800 bg-red-50 dark:text-red-400 dark:bg-gray-800'}`} role="alert">
											<span className="font-medium">{feedback.includes('successfully') ? 'Success' : 'Error'}</span> {feedback}
										</div>
									)}
									<p className="text-sm font-light text-gray-500 dark:text-gray-400">
										Already have an account?{' '}
										<Link href="/login" className="font-medium text-primary-600 hover:underline dark:text-primary-500">
											Login here
										</Link>
									</p>
								</form>
							</div>
						</div>
					</div>
				</section>
			</div>
		</main>
	);
}