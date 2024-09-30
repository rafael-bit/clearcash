"use client";

import { createContext, useContext, useState, useEffect } from 'react';

interface LanguageContextType {
	language: string;
	changeLanguage: (lang: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
	const [language, setLanguage] = useState<string>('en');

	useEffect(() => {
		const savedLanguage = localStorage.getItem('language');
		if (savedLanguage) {
			setLanguage(savedLanguage);
		}
	}, []);

	const changeLanguage = (lang: string) => {
		setLanguage(lang);
		localStorage.setItem('language', lang);
	};

	return (
		<LanguageContext.Provider value={{ language, changeLanguage }}>
			{children}
		</LanguageContext.Provider>
	);
};

export const useLanguage = () => {
	const context = useContext(LanguageContext);
	if (context === undefined) {
		throw new Error('useLanguage must be used within a LanguageProvider');
	}
	return context;
};
