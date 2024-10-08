"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Signup() {
	const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
	const [feedback, setFeedback] = useState<string | null>(null);
	const router = useRouter();

	const submitSignupForm = async () => {
		const { name, email, password, confirmPassword } = formData;

		if (password !== confirmPassword) {
			setFeedback('Passwords do not match.');
			return;
		}

		try {
			const response = await fetch('https://clearcashback.onrender.com/api/users', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, email, password }),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Failed to create an account. Please try again.');
			}

			setFeedback('Account created successfully!');
			setTimeout(() => router.push('/'), 500);
		} catch (error: any) {
			console.error('Error during submission:', error);
			setFeedback(error.message);
		}
	};

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		submitSignupForm();
	};

	useEffect(() => {
		if (feedback) {
			const timeoutId = setTimeout(() => setFeedback(null), 5000);
			return () => clearTimeout(timeoutId);
		}
	}, [feedback]);

	return (
		<main>
			<div className="w-full h-screen z-50 shadow">
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
								<form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
									<InputField
										id="name"
										label="Your name"
										type="text"
										placeholder="Paul Matter"
										value={formData.name}
										onChange={handleInputChange}
										required
									/>
									<InputField
										id="email"
										label="Your email"
										type="email"
										placeholder="name@company.com"
										value={formData.email}
										onChange={handleInputChange}
										required
									/>
									<InputField
										id="password"
										label="Password"
										type="password"
										placeholder="••••••••"
										value={formData.password}
										onChange={handleInputChange}
										required
									/>
									<InputField
										id="confirmPassword"
										label="Confirm password"
										type="password"
										placeholder="••••••••"
										value={formData.confirmPassword}
										onChange={handleInputChange}
										required
										error={feedback?.includes('Passwords do not match')}
									/>

									<div className="flex items-start">
										<CheckboxField />
										<TermsLink />
									</div>

									<button
										type="submit"
										className="w-full border-none bg-gray-600 hover:bg-gray-700 focus:ring-4 font-medium rounded-lg text-md px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800 border dark:text-white"
									>
										Create an account
									</button>

									{feedback && (
										<FeedbackMessage feedback={feedback} />
									)}

									<p className="text-sm font-light text-gray-500 dark:text-gray-400">
										Already have an account?{' '}
										<Link href="/" className="font-medium text-gray-600 hover:underline dark:text-gray-500">
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

const InputField = ({
	id,
	label,
	type,
	placeholder,
	value,
	onChange,
	required,
	error = false,
}: {
	id: string;
	label: string;
	type: string;
	placeholder: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	required?: boolean;
	error?: boolean;
}) => (
	<div>
		<label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
			{label}
		</label>
		<input
			id={id}
			name={id}
			type={type}
			placeholder={placeholder}
			value={value}
			onChange={onChange}
			required={required}
			className={`bg-gray-50 border ${error ? 'border-red-500' : 'border-gray-300'} text-gray-900 sm:text-sm rounded-lg focus:ring-gray-600 focus:border-gray-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
		/>
	</div>
);

const CheckboxField = () => (
	<div className="flex items-center h-5">
		<input
			id="terms"
			aria-describedby="terms"
			type="checkbox"
			className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-gray-600 dark:ring-offset-gray-800"
			required
		/>
	</div>
);

const TermsLink = () => (
	<div className="ml-3 text-sm">
		<label htmlFor="terms" className="font-light text-gray-500 dark:text-gray-300">
			I accept the{' '}
			<Link href="/terms" className="font-medium text-gray-600 hover:underline dark:text-gray-500">
				Terms and Conditions
			</Link>
		</label>
	</div>
);

const FeedbackMessage = ({ feedback }: { feedback: string }) => (
	<div
		className={`fixed top-0 p-4 mb-4 text-sm ${feedback.includes('successfully') ? 'text-green-800 bg-green-50 dark:text-green-400 dark:bg-gray-800' : 'text-red-800 bg-red-50 dark:text-red-400 dark:bg-gray-800'}`}
		role="alert"
	>
		<span className="font-medium">{feedback.includes('successfully') ? 'Success' : 'Error'}</span> {feedback}
	</div>
);