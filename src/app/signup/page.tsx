import React from 'react';
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';

type FormData = {
	name: string;
	email: string;
	password: string;
	imagem: string;
};

export default function Signup() {
	const { handleSubmit, register } = useForm<FormData>();

	const onSubmit: SubmitHandler<FormData> = (data) => console.log(data);
	const onError: SubmitErrorHandler<FormData> = (errors) => console.log(errors);

	return (
		<section className="mt-10 bg-gray-50 dark:bg-gray-900">
			<div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
				<a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
					<img className="w-8 h-8 mr-2" src="icon-init.png" alt="logo" />
					ClearCash
				</a>
				<div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
					<div className="p-6 space-y-4 md:space-y-6 sm:p-8">
						<h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
							Create an account
						</h1>
						<form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit, onError)}>
							<div>
								<label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
									Your name
								</label>
								<input
									{...register('name')}
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
									{...register('email')}
									type="email"
									name="email"
									id="email"
									className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
									placeholder="name@company.com"
								/>
							</div>
							<div>
								<label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
									Password
								</label>
								<input
									{...register('password')}
									type="password"
									name="password"
									id="password"
									placeholder="••••••••"
									className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
								/>
							</div>
							<div>
								<label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
									Confirm password
								</label>
								<input
									type="password"
									name="confirmPassword"
									id="confirm-password"
									placeholder="••••••••"
									className={`bg-gray-50 border border-red-500' : 'border-gray-300'} text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
								/>
							</div>
							<div className="flex items-center justify-center w-full">
								<label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
									<div className="flex flex-col items-center justify-center pt-5 pb-6">
										<svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
											<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
										</svg>
										<p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
											<span className="font-semibold">Click to upload</span> or drag and drop
										</p>
										<p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
									</div>
									<input id="dropzone-file" type="file" className="hidden" />
								</label>
							</div>
							<div className="flex items-start">
								<div className="flex items-center h-5">
									<input
										id="terms"
										aria-describedby="terms"
										type="checkbox"
										className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
									/>
								</div>
								<div className="ml-3 text-sm">
									<label htmlFor="terms" className="font-light text-gray-500 dark:text-gray-300">
										I accept the <a className="font-medium text-primary-600 hover:underline dark:text-primary-500" href="/terms">Terms and Conditions</a>
									</label>
								</div>
							</div>
							<button
								type="submit"
								className="w-full bg-primary-600 hover:bg-primary-700 focus:ring-4 font-medium rounded-lg text-md px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 border"
							>
								Create an account
							</button>
							<p className="text-sm font-light text-gray-500 dark:text-gray-400">
								Already have an account? <a href="/" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Login here</a>
							</p>
						</form>
					</div>
				</div>
			</div>
		</section>
	);
}
