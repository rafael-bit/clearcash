import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';

export default function ThemeSwitcher() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	const [showOptions, setShowOptions] = useState(false);
	const optionsRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
				setShowOptions(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	if (!mounted) return null;

	const themes = [
		{
			value: 'system',
			label: 'System Default',
			icon: (
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
					<path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
				</svg>
			),
		},
		{
			value: 'light',
			label: 'Light',
			icon: (
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
					<path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
				</svg>
			),
		},
		{
			value: 'dark',
			label: 'Dark',
			icon: (
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
					<path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
				</svg>
			),
		},
	];

	const handleThemeChange = (value: any) => {
		setTheme(value);
		setShowOptions(false);
	};

	return (
		<div className="relative inline-block">
			<button
				onClick={() => setShowOptions(!showOptions)}
				className="transition-all duration-100 inline-flex justify-center p-2 text-gray-500 rounded cursor-pointer dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
			>
				<svg aria-hidden="true" className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
					<path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z"></path>
				</svg>
			</button>

			{showOptions && (
				<div
					ref={optionsRef}
					className="absolute -top-40 bg-white dark:bg-gray-800 mt-1 z-10 border border-gray-300 dark:border-gray-500 shadow-lg rounded-lg"
				>
					{themes.map(({ value, label, icon }) => (
						<button
							key={value}
							onClick={() => handleThemeChange(value)}
							className="flex items-center py-2 px-3 w-full text-left hover:bg-gray-200 dark:hover:bg-gray-700"
						>
							<span className="mr-2">{icon}</span>
							{label}
						</button>
					))}
				</div>
			)}
		</div>
	);
}
